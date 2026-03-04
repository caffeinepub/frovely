import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Text "mo:core/Text";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Product Type
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    priceCents : Nat;
    inStock : Bool;
    createdAt : Int;
    imageUrls : [Text];
  };

  // Order Type
  public type Order = {
    orderId : Text;
    customerName : Text;
    email : Text;
    shippingAddress : Text;
    productId : Text;
    quantity : Nat;
    totalCents : Nat;
    paymentStatus : Text;
    stripeSessionId : Text;
    purchaseDate : Int;
  };

  module OrderModule {
    public func compareByDate(a : Order, b : Order) : Order.Order {
      Int.compare(b.purchaseDate, a.purchaseDate);
    };
  };

  // Persistent Maps
  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, Order>();

  // Stripe Config
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // 1. Product Management Functions
  public shared ({ caller }) func createProduct(id : Text, name : Text, description : Text, priceCents : Nat, imageUrls : [Text]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let product : Product = {
      id;
      name;
      description;
      priceCents;
      inStock = true;
      createdAt = Time.now();
      imageUrls;
    };

    products.add(id, product);
  };

  public shared ({ caller }) func updateProduct(id : Text, name : Text, description : Text, priceCents : Nat, inStock : Bool, imageUrls : [Text]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let updatedProduct : Product = {
      id;
      name;
      description;
      priceCents;
      inStock;
      createdAt = Time.now();
      imageUrls;
    };

    products.add(id, updatedProduct);
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    products.remove(id);
  };

  public query ({ caller }) func getProduct(id : Text) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  // 2. Order Management
  public shared ({ caller }) func createOrder(customerName : Text, email : Text, shippingAddress : Text, productId : Text, quantity : Nat, totalCents : Nat, stripeSessionId : Text) : async Text {
    let orderId = productId.concat(Time.now().toText());

    let newOrder : Order = {
      orderId;
      customerName;
      email;
      shippingAddress;
      productId;
      quantity;
      totalCents;
      paymentStatus = "pending";
      stripeSessionId;
      purchaseDate = Time.now();
    };

    orders.add(orderId, newOrder);
    orderId;
  };

  public shared ({ caller }) func updateOrderPaymentStatus(orderId : Text, status : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?existingOrder) {
        let updatedOrder : Order = {
          orderId = existingOrder.orderId;
          customerName = existingOrder.customerName;
          email = existingOrder.email;
          shippingAddress = existingOrder.shippingAddress;
          productId = existingOrder.productId;
          quantity = existingOrder.quantity;
          totalCents = existingOrder.totalCents;
          paymentStatus = status;
          stripeSessionId = existingOrder.stripeSessionId;
          purchaseDate = existingOrder.purchaseDate;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    orders.values().toArray().sort(OrderModule.compareByDate);
  };

  public query ({ caller }) func getOrderById(orderId : Text) : async Order {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) { order };
    };
  };

  // 3. Stripe Integration
  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe not configured! ") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };
};
