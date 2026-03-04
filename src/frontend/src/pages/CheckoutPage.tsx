import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ChevronLeft,
  Loader2,
  Lock,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useActor } from "../hooks/useActor";
import { useCreateCheckoutSession } from "../hooks/useQueries";

const PRODUCT_MAP: Record<
  string,
  { name: string; priceCents: bigint; image: string; description: string }
> = {
  "frovely-routine-set": {
    name: "Frovely PDRN + Rosemary Scalp Routine Set",
    priceCents: 6500n,
    image: "/assets/generated/hero-product-set.dim_1200x800.jpg",
    description:
      "Includes Rosemary PDRN Cooling Thickening Shampoo (400ml), Rosemary PDRN Hair & Scalp Conditioner (250ml), and Rosemary PDRN Scalp Serum (20ml).",
  },
  "frovely-duo": {
    name: "Frovely Rosemary PDRN Shampoo + Conditioner Duo",
    priceCents: 4900n,
    image: "/assets/generated/duo-product.dim_800x800.jpg",
    description:
      "Daily scalp-care duo — Rosemary PDRN Shampoo (400ml) + Conditioner (250ml).",
  },
};

// ─── World geography data ─────────────────────────────────────────────────────

type CountryEntry = {
  code: string;
  name: string;
  states?: { code: string; name: string; cities?: string[] }[];
};

const COUNTRIES: CountryEntry[] = [
  {
    code: "US",
    name: "United States",
    states: [
      {
        code: "AL",
        name: "Alabama",
        cities: ["Birmingham", "Montgomery", "Huntsville", "Mobile"],
      },
      {
        code: "AK",
        name: "Alaska",
        cities: ["Anchorage", "Fairbanks", "Juneau"],
      },
      {
        code: "AZ",
        name: "Arizona",
        cities: ["Phoenix", "Tucson", "Mesa", "Scottsdale"],
      },
      {
        code: "AR",
        name: "Arkansas",
        cities: ["Little Rock", "Fort Smith", "Fayetteville"],
      },
      {
        code: "CA",
        name: "California",
        cities: [
          "Los Angeles",
          "San Francisco",
          "San Diego",
          "Sacramento",
          "San Jose",
        ],
      },
      {
        code: "CO",
        name: "Colorado",
        cities: ["Denver", "Colorado Springs", "Aurora", "Boulder"],
      },
      {
        code: "CT",
        name: "Connecticut",
        cities: ["Hartford", "Bridgeport", "New Haven", "Stamford"],
      },
      {
        code: "DE",
        name: "Delaware",
        cities: ["Wilmington", "Dover", "Newark"],
      },
      {
        code: "FL",
        name: "Florida",
        cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"],
      },
      {
        code: "GA",
        name: "Georgia",
        cities: ["Atlanta", "Savannah", "Augusta", "Columbus"],
      },
      {
        code: "HI",
        name: "Hawaii",
        cities: ["Honolulu", "Pearl City", "Hilo"],
      },
      { code: "ID", name: "Idaho", cities: ["Boise", "Nampa", "Idaho Falls"] },
      {
        code: "IL",
        name: "Illinois",
        cities: ["Chicago", "Aurora", "Naperville", "Rockford", "Springfield"],
      },
      {
        code: "IN",
        name: "Indiana",
        cities: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend"],
      },
      {
        code: "IA",
        name: "Iowa",
        cities: ["Des Moines", "Cedar Rapids", "Davenport"],
      },
      {
        code: "KS",
        name: "Kansas",
        cities: ["Wichita", "Overland Park", "Kansas City", "Topeka"],
      },
      {
        code: "KY",
        name: "Kentucky",
        cities: ["Louisville", "Lexington", "Bowling Green"],
      },
      {
        code: "LA",
        name: "Louisiana",
        cities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette"],
      },
      { code: "ME", name: "Maine", cities: ["Portland", "Lewiston", "Bangor"] },
      {
        code: "MD",
        name: "Maryland",
        cities: ["Baltimore", "Columbia", "Germantown", "Silver Spring"],
      },
      {
        code: "MA",
        name: "Massachusetts",
        cities: ["Boston", "Worcester", "Springfield", "Cambridge"],
      },
      {
        code: "MI",
        name: "Michigan",
        cities: ["Detroit", "Grand Rapids", "Warren", "Ann Arbor"],
      },
      {
        code: "MN",
        name: "Minnesota",
        cities: ["Minneapolis", "Saint Paul", "Rochester", "Duluth"],
      },
      {
        code: "MS",
        name: "Mississippi",
        cities: ["Jackson", "Gulfport", "Southaven"],
      },
      {
        code: "MO",
        name: "Missouri",
        cities: ["Kansas City", "Saint Louis", "Springfield", "Columbia"],
      },
      {
        code: "MT",
        name: "Montana",
        cities: ["Billings", "Missoula", "Great Falls"],
      },
      {
        code: "NE",
        name: "Nebraska",
        cities: ["Omaha", "Lincoln", "Bellevue"],
      },
      {
        code: "NV",
        name: "Nevada",
        cities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas"],
      },
      {
        code: "NH",
        name: "New Hampshire",
        cities: ["Manchester", "Nashua", "Concord"],
      },
      {
        code: "NJ",
        name: "New Jersey",
        cities: ["Newark", "Jersey City", "Paterson", "Trenton"],
      },
      {
        code: "NM",
        name: "New Mexico",
        cities: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe"],
      },
      {
        code: "NY",
        name: "New York",
        cities: ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
      },
      {
        code: "NC",
        name: "North Carolina",
        cities: [
          "Charlotte",
          "Raleigh",
          "Greensboro",
          "Durham",
          "Winston-Salem",
        ],
      },
      {
        code: "ND",
        name: "North Dakota",
        cities: ["Fargo", "Bismarck", "Grand Forks"],
      },
      {
        code: "OH",
        name: "Ohio",
        cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
      },
      {
        code: "OK",
        name: "Oklahoma",
        cities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow"],
      },
      {
        code: "OR",
        name: "Oregon",
        cities: ["Portland", "Eugene", "Salem", "Gresham"],
      },
      {
        code: "PA",
        name: "Pennsylvania",
        cities: [
          "Philadelphia",
          "Pittsburgh",
          "Allentown",
          "Erie",
          "Harrisburg",
        ],
      },
      {
        code: "RI",
        name: "Rhode Island",
        cities: ["Providence", "Warwick", "Cranston"],
      },
      {
        code: "SC",
        name: "South Carolina",
        cities: ["Columbia", "Charleston", "Greenville", "North Charleston"],
      },
      {
        code: "SD",
        name: "South Dakota",
        cities: ["Sioux Falls", "Rapid City", "Aberdeen"],
      },
      {
        code: "TN",
        name: "Tennessee",
        cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga"],
      },
      {
        code: "TX",
        name: "Texas",
        cities: [
          "Houston",
          "San Antonio",
          "Dallas",
          "Austin",
          "Fort Worth",
          "El Paso",
        ],
      },
      {
        code: "UT",
        name: "Utah",
        cities: ["Salt Lake City", "West Valley City", "Provo", "West Jordan"],
      },
      {
        code: "VT",
        name: "Vermont",
        cities: ["Burlington", "Essex", "South Burlington"],
      },
      {
        code: "VA",
        name: "Virginia",
        cities: [
          "Virginia Beach",
          "Norfolk",
          "Chesapeake",
          "Richmond",
          "Arlington",
        ],
      },
      {
        code: "WA",
        name: "Washington",
        cities: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
      },
      {
        code: "WV",
        name: "West Virginia",
        cities: ["Charleston", "Huntington", "Morgantown"],
      },
      {
        code: "WI",
        name: "Wisconsin",
        cities: ["Milwaukee", "Madison", "Green Bay", "Kenosha"],
      },
      {
        code: "WY",
        name: "Wyoming",
        cities: ["Cheyenne", "Casper", "Laramie"],
      },
    ],
  },
  {
    code: "GB",
    name: "United Kingdom",
    states: [
      {
        code: "ENG",
        name: "England",
        cities: [
          "London",
          "Birmingham",
          "Manchester",
          "Leeds",
          "Liverpool",
          "Bristol",
          "Sheffield",
          "Newcastle",
        ],
      },
      {
        code: "SCT",
        name: "Scotland",
        cities: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
      },
      {
        code: "WLS",
        name: "Wales",
        cities: ["Cardiff", "Swansea", "Newport", "Wrexham"],
      },
      {
        code: "NIR",
        name: "Northern Ireland",
        cities: ["Belfast", "Derry", "Lisburn", "Armagh"],
      },
    ],
  },
  {
    code: "CA",
    name: "Canada",
    states: [
      {
        code: "AB",
        name: "Alberta",
        cities: ["Calgary", "Edmonton", "Red Deer", "Lethbridge"],
      },
      {
        code: "BC",
        name: "British Columbia",
        cities: ["Vancouver", "Victoria", "Kelowna", "Abbotsford"],
      },
      {
        code: "MB",
        name: "Manitoba",
        cities: ["Winnipeg", "Brandon", "Steinbach"],
      },
      {
        code: "NB",
        name: "New Brunswick",
        cities: ["Fredericton", "Moncton", "Saint John"],
      },
      {
        code: "NL",
        name: "Newfoundland and Labrador",
        cities: ["St. John's", "Corner Brook", "Gander"],
      },
      {
        code: "NS",
        name: "Nova Scotia",
        cities: ["Halifax", "Dartmouth", "Sydney"],
      },
      {
        code: "ON",
        name: "Ontario",
        cities: ["Toronto", "Ottawa", "Mississauga", "Hamilton", "London"],
      },
      {
        code: "PE",
        name: "Prince Edward Island",
        cities: ["Charlottetown", "Summerside"],
      },
      {
        code: "QC",
        name: "Quebec",
        cities: ["Montreal", "Quebec City", "Laval", "Gatineau"],
      },
      {
        code: "SK",
        name: "Saskatchewan",
        cities: ["Saskatoon", "Regina", "Prince Albert"],
      },
    ],
  },
  {
    code: "AU",
    name: "Australia",
    states: [
      {
        code: "NSW",
        name: "New South Wales",
        cities: ["Sydney", "Newcastle", "Wollongong", "Central Coast"],
      },
      {
        code: "VIC",
        name: "Victoria",
        cities: ["Melbourne", "Geelong", "Ballarat", "Bendigo"],
      },
      {
        code: "QLD",
        name: "Queensland",
        cities: [
          "Brisbane",
          "Gold Coast",
          "Sunshine Coast",
          "Townsville",
          "Cairns",
        ],
      },
      {
        code: "WA",
        name: "Western Australia",
        cities: ["Perth", "Bunbury", "Geraldton"],
      },
      {
        code: "SA",
        name: "South Australia",
        cities: ["Adelaide", "Mount Gambier", "Whyalla"],
      },
      {
        code: "TAS",
        name: "Tasmania",
        cities: ["Hobart", "Launceston", "Devonport"],
      },
      {
        code: "ACT",
        name: "Australian Capital Territory",
        cities: ["Canberra"],
      },
      {
        code: "NT",
        name: "Northern Territory",
        cities: ["Darwin", "Alice Springs"],
      },
    ],
  },
  {
    code: "IN",
    name: "India",
    states: [
      {
        code: "MH",
        name: "Maharashtra",
        cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
      },
      { code: "DL", name: "Delhi", cities: ["New Delhi", "Delhi"] },
      {
        code: "KA",
        name: "Karnataka",
        cities: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
      },
      {
        code: "TN",
        name: "Tamil Nadu",
        cities: [
          "Chennai",
          "Coimbatore",
          "Madurai",
          "Tiruchirappalli",
          "Salem",
        ],
      },
      {
        code: "UP",
        name: "Uttar Pradesh",
        cities: ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Noida"],
      },
      {
        code: "WB",
        name: "West Bengal",
        cities: ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur"],
      },
      {
        code: "GJ",
        name: "Gujarat",
        cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
      },
      {
        code: "RJ",
        name: "Rajasthan",
        cities: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur"],
      },
      {
        code: "HR",
        name: "Haryana",
        cities: ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Hisar"],
      },
      {
        code: "MP",
        name: "Madhya Pradesh",
        cities: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
      },
      {
        code: "AP",
        name: "Andhra Pradesh",
        cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
      },
      {
        code: "TS",
        name: "Telangana",
        cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
      },
      {
        code: "KL",
        name: "Kerala",
        cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
      },
      {
        code: "PB",
        name: "Punjab",
        cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
      },
    ],
  },
  {
    code: "DE",
    name: "Germany",
    states: [
      {
        code: "BY",
        name: "Bavaria",
        cities: ["Munich", "Nuremberg", "Augsburg", "Regensburg"],
      },
      {
        code: "NW",
        name: "North Rhine-Westphalia",
        cities: ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Duisburg"],
      },
      {
        code: "BW",
        name: "Baden-Württemberg",
        cities: ["Stuttgart", "Karlsruhe", "Freiburg", "Heidelberg"],
      },
      { code: "BE", name: "Berlin", cities: ["Berlin"] },
      { code: "HH", name: "Hamburg", cities: ["Hamburg"] },
      {
        code: "HE",
        name: "Hesse",
        cities: ["Frankfurt", "Wiesbaden", "Kassel", "Darmstadt"],
      },
      {
        code: "SN",
        name: "Saxony",
        cities: ["Dresden", "Leipzig", "Chemnitz"],
      },
      {
        code: "RP",
        name: "Rhineland-Palatinate",
        cities: ["Mainz", "Ludwigshafen", "Koblenz", "Trier"],
      },
    ],
  },
  {
    code: "FR",
    name: "France",
    states: [
      {
        code: "IDF",
        name: "Île-de-France",
        cities: ["Paris", "Versailles", "Boulogne-Billancourt", "Saint-Denis"],
      },
      {
        code: "PACA",
        name: "Provence-Alpes-Côte d'Azur",
        cities: ["Marseille", "Nice", "Toulon", "Aix-en-Provence"],
      },
      {
        code: "ARA",
        name: "Auvergne-Rhône-Alpes",
        cities: ["Lyon", "Grenoble", "Saint-Étienne", "Clermont-Ferrand"],
      },
      {
        code: "OCC",
        name: "Occitanie",
        cities: ["Toulouse", "Montpellier", "Nîmes", "Perpignan"],
      },
      {
        code: "NAQ",
        name: "Nouvelle-Aquitaine",
        cities: ["Bordeaux", "Limoges", "Pau", "Bayonne"],
      },
    ],
  },
  {
    code: "JP",
    name: "Japan",
    states: [
      {
        code: "TK",
        name: "Tokyo",
        cities: ["Tokyo", "Shinjuku", "Shibuya", "Akihabara"],
      },
      { code: "OS", name: "Osaka", cities: ["Osaka", "Sakai", "Higashiosaka"] },
      {
        code: "KN",
        name: "Kanagawa",
        cities: ["Yokohama", "Kawasaki", "Sagamihara"],
      },
      { code: "AI", name: "Aichi", cities: ["Nagoya", "Toyota", "Okazaki"] },
      {
        code: "HK",
        name: "Hokkaido",
        cities: ["Sapporo", "Asahikawa", "Hakodate"],
      },
      {
        code: "FK",
        name: "Fukuoka",
        cities: ["Fukuoka", "Kitakyushu", "Kurume"],
      },
      {
        code: "HY",
        name: "Hyogo",
        cities: ["Kobe", "Himeji", "Amagasaki", "Nishinomiya"],
      },
      { code: "KY", name: "Kyoto", cities: ["Kyoto", "Uji", "Kameoka"] },
    ],
  },
  {
    code: "KR",
    name: "South Korea",
    states: [
      {
        code: "SE",
        name: "Seoul",
        cities: ["Seoul", "Gangnam", "Hongdae", "Myeongdong"],
      },
      { code: "BS", name: "Busan", cities: ["Busan", "Haeundae", "Seo-gu"] },
      {
        code: "IC",
        name: "Incheon",
        cities: ["Incheon", "Bupyeong", "Namdong"],
      },
      { code: "DG", name: "Daegu", cities: ["Daegu", "Suseong", "Dalseo"] },
      {
        code: "GG",
        name: "Gyeonggi",
        cities: ["Suwon", "Seongnam", "Bucheon", "Ansan", "Yongin"],
      },
      {
        code: "CB",
        name: "Chungcheongbuk",
        cities: ["Cheongju", "Chungju", "Jecheon"],
      },
      {
        code: "GB",
        name: "Gyeongsangbuk",
        cities: ["Andong", "Pohang", "Gyeongju"],
      },
    ],
  },
  {
    code: "SG",
    name: "Singapore",
    states: [
      {
        code: "SG",
        name: "Singapore",
        cities: [
          "Singapore",
          "Orchard",
          "Marina Bay",
          "Jurong",
          "Tampines",
          "Woodlands",
        ],
      },
    ],
  },
  {
    code: "MY",
    name: "Malaysia",
    states: [
      {
        code: "KL",
        name: "Kuala Lumpur",
        cities: ["Kuala Lumpur", "Petaling Jaya", "Cheras", "Kepong"],
      },
      {
        code: "SG",
        name: "Selangor",
        cities: ["Shah Alam", "Klang", "Subang Jaya", "Puchong"],
      },
      {
        code: "PG",
        name: "Penang",
        cities: ["George Town", "Butterworth", "Kepala Batas"],
      },
      {
        code: "JH",
        name: "Johor",
        cities: ["Johor Bahru", "Muar", "Batu Pahat", "Kluang"],
      },
    ],
  },
  {
    code: "TH",
    name: "Thailand",
    states: [
      {
        code: "BKK",
        name: "Bangkok",
        cities: ["Bangkok", "Lat Phrao", "Min Buri", "Don Mueang"],
      },
      {
        code: "CM",
        name: "Chiang Mai",
        cities: ["Chiang Mai", "Chiang Rai", "Mae Hong Son"],
      },
      {
        code: "CS",
        name: "Chon Buri",
        cities: ["Pattaya", "Chon Buri", "Bang Saen"],
      },
      {
        code: "PR",
        name: "Phuket",
        cities: ["Phuket", "Patong", "Kata", "Karon"],
      },
    ],
  },
  {
    code: "ID",
    name: "Indonesia",
    states: [
      {
        code: "JK",
        name: "Jakarta",
        cities: ["Jakarta", "South Jakarta", "North Jakarta", "West Jakarta"],
      },
      {
        code: "JB",
        name: "West Java",
        cities: ["Bandung", "Bekasi", "Bogor", "Depok"],
      },
      {
        code: "JT",
        name: "Central Java",
        cities: ["Semarang", "Surakarta", "Magelang"],
      },
      {
        code: "BA",
        name: "Bali",
        cities: ["Denpasar", "Kuta", "Ubud", "Seminyak"],
      },
    ],
  },
  {
    code: "PH",
    name: "Philippines",
    states: [
      {
        code: "MM",
        name: "Metro Manila",
        cities: [
          "Manila",
          "Quezon City",
          "Makati",
          "Pasig",
          "Taguig",
          "Caloocan",
        ],
      },
      {
        code: "CEB",
        name: "Cebu",
        cities: ["Cebu City", "Mandaue", "Lapu-Lapu"],
      },
      { code: "DAV", name: "Davao", cities: ["Davao City", "Panabo", "Tagum"] },
    ],
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    states: [
      {
        code: "DXB",
        name: "Dubai",
        cities: ["Dubai", "Jumeirah", "Deira", "Bur Dubai"],
      },
      {
        code: "AUH",
        name: "Abu Dhabi",
        cities: ["Abu Dhabi", "Al Ain", "Khalifa City"],
      },
      { code: "SHJ", name: "Sharjah", cities: ["Sharjah", "Khor Fakkan"] },
      { code: "AJM", name: "Ajman", cities: ["Ajman"] },
      { code: "RAK", name: "Ras Al Khaimah", cities: ["Ras Al Khaimah"] },
    ],
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    states: [
      {
        code: "RYD",
        name: "Riyadh",
        cities: ["Riyadh", "Al Kharj", "Al Diriyah"],
      },
      { code: "JED", name: "Makkah", cities: ["Jeddah", "Mecca", "Taif"] },
      { code: "MED", name: "Madinah", cities: ["Medina", "Yanbu"] },
      {
        code: "EAS",
        name: "Eastern Province",
        cities: ["Dammam", "Dhahran", "Al-Ahsa"],
      },
    ],
  },
  {
    code: "ZA",
    name: "South Africa",
    states: [
      {
        code: "GP",
        name: "Gauteng",
        cities: ["Johannesburg", "Pretoria", "Ekurhuleni", "Sandton"],
      },
      {
        code: "WC",
        name: "Western Cape",
        cities: ["Cape Town", "Stellenbosch", "George"],
      },
      {
        code: "KZN",
        name: "KwaZulu-Natal",
        cities: ["Durban", "Pietermaritzburg", "Richards Bay"],
      },
    ],
  },
  {
    code: "BR",
    name: "Brazil",
    states: [
      {
        code: "SP",
        name: "São Paulo",
        cities: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto"],
      },
      {
        code: "RJ",
        name: "Rio de Janeiro",
        cities: ["Rio de Janeiro", "Niterói", "Nova Iguaçu"],
      },
      {
        code: "MG",
        name: "Minas Gerais",
        cities: ["Belo Horizonte", "Uberlândia", "Contagem"],
      },
      {
        code: "BA",
        name: "Bahia",
        cities: ["Salvador", "Feira de Santana", "Vitória da Conquista"],
      },
    ],
  },
  {
    code: "MX",
    name: "Mexico",
    states: [
      {
        code: "CDMX",
        name: "Mexico City",
        cities: ["Mexico City", "Tlalpan", "Iztapalapa", "Coyoacán"],
      },
      {
        code: "JAL",
        name: "Jalisco",
        cities: ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá"],
      },
      {
        code: "NL",
        name: "Nuevo León",
        cities: ["Monterrey", "San Nicolás", "Guadalupe", "Apodaca"],
      },
      {
        code: "YUC",
        name: "Yucatán",
        cities: ["Mérida", "Progreso", "Valladolid"],
      },
    ],
  },
  {
    code: "NG",
    name: "Nigeria",
    states: [
      {
        code: "LA",
        name: "Lagos",
        cities: ["Lagos", "Ikeja", "Victoria Island", "Lekki"],
      },
      {
        code: "AB",
        name: "Abuja FCT",
        cities: ["Abuja", "Garki", "Wuse", "Maitama"],
      },
      { code: "KN", name: "Kano", cities: ["Kano", "Wudil", "Gaya"] },
      {
        code: "RV",
        name: "Rivers",
        cities: ["Port Harcourt", "Obio", "Okrika"],
      },
    ],
  },
  {
    code: "EG",
    name: "Egypt",
    states: [
      {
        code: "CAI",
        name: "Cairo",
        cities: ["Cairo", "Heliopolis", "Maadi", "Nasr City"],
      },
      {
        code: "ALX",
        name: "Alexandria",
        cities: ["Alexandria", "Borg El Arab"],
      },
      {
        code: "GIZ",
        name: "Giza",
        cities: ["Giza", "6th of October", "Sheikh Zayed"],
      },
    ],
  },
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CV", name: "Cabo Verde" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CD", name: "Congo (DRC)" },
  { code: "CG", name: "Congo (Republic)" },
  { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "GD", name: "Grenada" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Laos" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const search = useSearch({ from: "/checkout" }) as Record<string, string>;
  const navigate = useNavigate();

  const productId = search?.productId ?? "frovely-routine-set";
  const quantity = Math.max(1, Number(search?.quantity ?? "1"));

  const product = PRODUCT_MAP[productId] ?? PRODUCT_MAP["frovely-routine-set"];
  const totalCents = product.priceCents * BigInt(quantity);
  const totalDisplay = (Number(totalCents) / 100).toFixed(2);
  const unitPrice = (Number(product.priceCents) / 100).toFixed(2);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Derived lists
  const selectedCountry = COUNTRIES.find((c) => c.code === country);
  const states = selectedCountry?.states ?? [];
  const selectedState = states.find((s) => s.code === state);
  const cities = selectedState?.cities ?? [];

  // Reset state/city when country changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset on country change
  useEffect(() => {
    setState("");
    setCity("");
    setCityInput("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]); // eslint-disable-line

  // Reset city when state changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset on state change
  useEffect(() => {
    setCity("");
    setCityInput("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]); // eslint-disable-line

  const { actor, isFetching: actorFetching } = useActor();
  const { mutateAsync: createCheckoutSession } = useCreateCheckoutSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter your first and last name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (!country) {
      toast.error("Please select your country.");
      return;
    }
    if (!addressLine.trim()) {
      toast.error("Please enter your street address.");
      return;
    }
    if (!pinCode.trim()) {
      toast.error("Please enter your PIN / postal code.");
      return;
    }

    // If actor is still loading, wait a moment and retry
    if (!actor) {
      if (actorFetching) {
        toast.info(
          "Connecting to payment system, please try again in a moment.",
        );
      } else {
        toast.error(
          "Could not connect to the payment system. Please refresh and try again.",
        );
      }
      return;
    }

    setIsProcessing(true);
    try {
      const successUrl = `${window.location.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/checkout?productId=${productId}&quantity=${quantity}`;

      const resolvedCity = city || cityInput.trim();
      const resolvedState = selectedState?.name || state;
      const _fullAddress = [
        addressLine.trim(),
        resolvedCity,
        resolvedState,
        selectedCountry?.name || country,
        pinCode.trim(),
      ]
        .filter(Boolean)
        .join(", ");

      const stripeUrl = await createCheckoutSession({
        items: [
          {
            productName: product.name,
            currency: "usd",
            quantity: BigInt(quantity),
            priceInCents: product.priceCents,
            productDescription: `Frovely ${product.name}`,
          },
        ],
        successUrl,
        cancelUrl,
      });

      if (stripeUrl?.startsWith("http")) {
        window.location.href = stripeUrl;
      } else {
        toast.error(
          "Stripe is not yet configured. Please go to Admin → Payment Settings and add your Stripe secret key to activate checkout.",
        );
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Header */}
        <div
          className="py-12 mb-10 border-b border-border"
          style={{
            background: "linear-gradient(135deg, #fff5f8 0%, #ffeef4 100%)",
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/products/$id"
              params={{ id: productId }}
              className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-primary transition-colors mb-5"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Product
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Secure Checkout
            </h1>
            <p className="mt-2 font-body text-muted-foreground text-sm">
              Complete your order below. Payment is secured by Stripe.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Form -- left col */}
            <div className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-border p-8 space-y-6 card-shadow"
                data-ocid="checkout.form"
              >
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                    Your Information
                  </h2>
                  <p className="font-body text-sm text-muted-foreground">
                    We'll send your order confirmation to your email.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* First Name */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="checkout-firstname"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      First Name
                    </Label>
                    <Input
                      id="checkout-firstname"
                      type="text"
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="font-body border-border focus:ring-primary rounded-xl"
                      data-ocid="checkout.firstname_input"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="checkout-lastname"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="checkout-lastname"
                      type="text"
                      placeholder="Kim"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="font-body border-border focus:ring-primary rounded-xl"
                      data-ocid="checkout.lastname_input"
                    />
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label
                      htmlFor="checkout-email"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="checkout-email"
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="font-body border-border focus:ring-primary rounded-xl"
                      data-ocid="checkout.email_input"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label
                      htmlFor="checkout-phone"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="checkout-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="font-body border-border focus:ring-primary rounded-xl"
                      data-ocid="checkout.phone_input"
                    />
                  </div>
                </div>

                {/* Shipping Address Section */}
                <div className="space-y-5 border-t border-border pt-5">
                  <h3 className="font-display text-base font-semibold text-foreground">
                    Shipping Address
                  </h3>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm font-medium text-foreground">
                      Country
                    </Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger
                        className="font-body border-border rounded-xl w-full"
                        data-ocid="checkout.country_select"
                      >
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* State / Province */}
                  {states.length > 0 && (
                    <div className="space-y-1.5">
                      <Label className="font-body text-sm font-medium text-foreground">
                        State / Province / Region
                      </Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger
                          className="font-body border-border rounded-xl w-full"
                          data-ocid="checkout.state_select"
                        >
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {states.map((s) => (
                            <SelectItem key={s.code} value={s.code}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* City */}
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm font-medium text-foreground">
                      City
                    </Label>
                    {cities.length > 0 ? (
                      <Select value={city} onValueChange={setCity}>
                        <SelectTrigger
                          className="font-body border-border rounded-xl w-full"
                          data-ocid="checkout.city_select"
                        >
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {cities.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                          <SelectItem value="__other__">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type="text"
                        placeholder="Enter your city"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        className="font-body border-border focus:ring-primary rounded-xl"
                        data-ocid="checkout.city_input"
                      />
                    )}
                    {city === "__other__" && (
                      <Input
                        type="text"
                        placeholder="Enter your city"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        className="font-body border-border focus:ring-primary rounded-xl mt-2"
                        data-ocid="checkout.city_other_input"
                      />
                    )}
                  </div>

                  {/* Street Address */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="checkout-address"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      Street Address
                    </Label>
                    <Input
                      id="checkout-address"
                      type="text"
                      placeholder="123 Beauty Lane, Apt 4B"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      required
                      className="font-body border-border focus:ring-primary rounded-xl"
                      data-ocid="checkout.address_input"
                    />
                  </div>

                  {/* PIN / Postal Code */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="checkout-pincode"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      PIN / Postal Code
                    </Label>
                    <Input
                      id="checkout-pincode"
                      type="text"
                      placeholder="110001"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      required
                      className="font-body border-border focus:ring-primary rounded-xl"
                      data-ocid="checkout.pincode_input"
                    />
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 pt-2 border-t border-border">
                  <span className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    SSL Encrypted
                  </span>
                  <span className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                    <Lock className="w-4 h-4 text-primary" />
                    Secured by Stripe
                  </span>
                  <span className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                    <RotateCcw className="w-4 h-4 text-blue-500" />
                    30-day returns
                  </span>
                  <span className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                    <Truck className="w-4 h-4 text-green-500" />
                    Free Shipping
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate({ to: `/products/${productId}` })}
                    className="font-body rounded-full border-border px-6"
                    data-ocid="checkout.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-primary text-white hover:bg-primary/90 font-body font-semibold rounded-full shadow-pink transition-all duration-300 hover:scale-[1.02] py-5 text-base"
                    data-ocid="checkout.submit_button"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Pay ${totalDisplay} Securely
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order summary -- right col */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-border p-6 card-shadow space-y-5">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Order Summary
                </h2>

                {/* Product */}
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-accent">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground leading-snug">
                      {product.name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
                      {product.description}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      Qty: {quantity}
                    </p>
                  </div>
                </div>

                {/* Pricing breakdown */}
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">
                      Subtotal ({quantity}x)
                    </span>
                    <span className="text-foreground">${unitPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-border pt-4">
                  <span className="font-body font-semibold text-foreground">
                    Total
                  </span>
                  <span className="font-display text-2xl font-bold text-foreground">
                    ${totalDisplay}
                  </span>
                </div>

                <div className="text-xs font-body text-muted-foreground text-center">
                  Free worldwide shipping on all orders.
                </div>
              </div>

              {/* Why buy */}
              <div
                className="rounded-2xl p-5 space-y-3"
                style={{
                  background:
                    "linear-gradient(135deg, #fff5f8 0%, #ffeef4 100%)",
                  border: "1px solid #f8c9d6",
                }}
              >
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">
                  Why Frovely?
                </p>
                {[
                  "PDRN + Rosemary scientifically inspired formula",
                  "Korean beauty brand quality",
                  "Cruelty-free & dermatologist-tested",
                  "30-day satisfaction guarantee",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="font-body text-xs text-foreground/75 leading-snug">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
