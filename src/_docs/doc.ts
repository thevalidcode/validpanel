export const currency = {
  AED: "United Arab Emirates dirham",
  AFN: "Afghan afghani",
  ALL: "Albanian lek",
  AMD: "Armenian dram",
  ANG: "Netherlands Antillean guilder",
  AOA: "Angolan kwanza",
  ARS: "Argentine peso",
  AUD: "Australian dollar",
  AWG: "Aruban florin",
  AZN: "Azerbaijani manat",
  BAM: "Bosnia and Herzegovina convertible mark",
  BBD: "Barbados dollar",
  BDT: "Bangladeshi taka",
  BGN: "Bulgarian lev",
  BHD: "Bahraini dinar",
  BIF: "Burundian franc",
  BMD: "Bermudian dollar",
  BND: "Brunei dollar",
  BOB: "Boliviano",
  BRL: "Brazilian real",
  BSD: "Bahamian dollar",
  BTN: "Bhutanese ngultrum",
  BWP: "Botswana pula",
  BYN: "New Belarusian ruble",
  BYR: "Belarusian ruble",
  BZD: "Belize dollar",
  CAD: "Canadian dollar",
  CDF: "Congolese franc",
  CHF: "Swiss franc",
  CLF: "Unidad de Fomento",
  CLP: "Chilean peso",
  CNY: "Renminbi|Chinese yuan",
  COP: "Colombian peso",
  CRC: "Costa Rican colon",
  CUC: "Cuban convertible peso",
  CUP: "Cuban peso",
  CVE: "Cape Verde escudo",
  CZK: "Czech koruna",
  DJF: "Djiboutian franc",
  DKK: "Danish krone",
  DOP: "Dominican peso",
  DZD: "Algerian dinar",
  EGP: "Egyptian pound",
  ERN: "Eritrean nakfa",
  ETB: "Ethiopian birr",
  EUR: "Euro",
  FJD: "Fiji dollar",
  FKP: "Falkland Islands pound",
  GBP: "Pound sterling",
  GEL: "Georgian lari",
  GHS: "Ghanaian cedi",
  GIP: "Gibraltar pound",
  GMD: "Gambian dalasi",
  GNF: "Guinean franc",
  GTQ: "Guatemalan quetzal",
  GYD: "Guyanese dollar",
  HKD: "Hong Kong dollar",
  HNL: "Honduran lempira",
  HRK: "Croatian kuna",
  HTG: "Haitian gourde",
  HUF: "Hungarian forint",
  IDR: "Indonesian rupiah",
  ILS: "Israeli new shekel",
  INR: "Indian rupee",
  IQD: "Iraqi dinar",
  IRR: "Iranian rial",
  ISK: "Icelandic króna",
  JMD: "Jamaican dollar",
  JOD: "Jordanian dinar",
  JPY: "Japanese yen",
  KES: "Kenyan shilling",
  KGS: "Kyrgyzstani som",
  KHR: "Cambodian riel",
  KMF: "Comoro franc",
  KPW: "North Korean won",
  KRW: "South Korean won",
  KWD: "Kuwaiti dinar",
  KYD: "Cayman Islands dollar",
  KZT: "Kazakhstani tenge",
  LAK: "Lao kip",
  LBP: "Lebanese pound",
  LKR: "Sri Lankan rupee",
  LRD: "Liberian dollar",
  LSL: "Lesotho loti",
  LYD: "Libyan dinar",
  MAD: "Moroccan dirham",
  MDL: "Moldovan leu",
  MGA: "Malagasy ariary",
  MKD: "Macedonian denar",
  MMK: "Myanmar kyat",
  MNT: "Mongolian tögrög",
  MOP: "Macanese pataca",
  MRO: "Mauritanian ouguiya",
  MUR: "Mauritian rupee",
  MVR: "Maldivian rufiyaa",
  MWK: "Malawian kwacha",
  MXN: "Mexican peso",
  MXV: "Mexican Unidad de Inversion",
  MYR: "Malaysian ringgit",
  MZN: "Mozambican metical",
  NAD: "Namibian dollar",
  NGN: "Nigerian naira",
  NIO: "Nicaraguan córdoba",
  NOK: "Norwegian krone",
  NPR: "Nepalese rupee",
  NZD: "New Zealand dollar",
  OMR: "Omani rial",
  PAB: "Panamanian balboa",
  PEN: "Peruvian Sol",
  PGK: "Papua New Guinean kina",
  PHP: "Philippine peso",
  PKR: "Pakistani rupee",
  PLN: "Polish złoty",
  PYG: "Paraguayan guaraní",
  QAR: "Qatari riyal",
  RON: "Romanian leu",
  RSD: "Serbian dinar",
  RUB: "Russian ruble",
  RWF: "Rwandan franc",
  SAR: "Saudi riyal",
  SBD: "Solomon Islands dollar",
  SCR: "Seychelles rupee",
  SDG: "Sudanese pound",
  SEK: "Swedish krona",
  SGD: "Singapore dollar",
  SHP: "Saint Helena pound",
  SLL: "Sierra Leonean leone",
  SOS: "Somali shilling",
  SRD: "Surinamese dollar",
  SSP: "South Sudanese pound",
  STD: "São Tomé and Príncipe dobra",
  SVC: "Salvadoran colón",
  SYP: "Syrian pound",
  SZL: "Swazi lilangeni",
  THB: "Thai baht",
  TJS: "Tajikistani somoni",
  TMT: "Turkmenistani manat",
  TND: "Tunisian dinar",
  TOP: "Tongan paʻanga",
  TRY: "Turkish lira",
  TTD: "Trinidad and Tobago dollar",
  TWD: "New Taiwan dollar",
  TZS: "Tanzanian shilling",
  UAH: "Ukrainian hryvnia",
  UGX: "Ugandan shilling",
  USD: "United States dollar",
  UYI: "Uruguay Peso en Unidades Indexadas",
  UYU: "Uruguayan peso",
  UZS: "Uzbekistan som",
  VEF: "Venezuelan bolívar",
  VND: "Vietnamese đồng",
  VUV: "Vanuatu vatu",
  WST: "Samoan tala",
  XAF: "Central African CFA franc",
  XCD: "East Caribbean dollar",
  XOF: "West African CFA franc",
  XPF: "CFP franc",
  XXX: "No currency",
  YER: "Yemeni rial",
  ZAR: "South African rand",
  ZMW: "Zambian kwacha",
  ZWL: "Zimbabwean dollar",
};

export function getCurrencySymbol(currencyCode: string) {
  const shortCurrencyCode = currencyCode?.substring(0, 3);
  if (shortCurrencyCode && shortCurrencyCode !== "") {
    const currencySymbols = {
      AED: "د.إ", // United Arab Emirates Dirham
      AFN: "؋", // Afghan Afghani
      ALL: "L", // Albanian Lek
      AMD: "֏", // Armenian Dram
      ANG: "ƒ", // Netherlands Antillean Guilder
      AOA: "Kz", // Angolan Kwanza
      ARS: "$", // Argentine Peso
      AUD: "$", // Australian Dollar
      AWG: "ƒ", // Aruban Florin
      AZN: "₼", // Azerbaijani Manat
      BAM: "КМ", // Bosnia-Herzegovina Convertible Mark
      BBD: "$", // Barbadian Dollar
      BDT: "৳", // Bangladeshi Taka
      BGN: "лв", // Bulgarian Lev
      BHD: ".د.ب", // Bahraini Dinar
      BIF: "FBu", // Burundian Franc
      BMD: "$", // Bermudian Dollar
      BND: "$", // Brunei Dollar
      BOB: "Bs.", // Bolivian Boliviano
      BRL: "R$", // Brazilian Real
      BSD: "$", // Bahamian Dollar
      BTN: "Nu.", // Bhutanese Ngultrum
      BWP: "P", // Botswana Pula
      BYN: "Br", // Belarusian Ruble
      BZD: "$", // Belize Dollar
      CAD: "$", // Canadian Dollar
      CDF: "FC", // Congolese Franc
      CHF: "CHF", // Swiss Franc
      CLP: "$", // Chilean Peso
      CNY: "¥", // Chinese Yuan
      COP: "$", // Colombian Peso
      CRC: "₡", // Costa Rican Colón
      CUP: "₱", // Cuban Peso
      CVE: "$", // Cape Verdean Escudo
      CZK: "Kč", // Czech Koruna
      DJF: "Fdj", // Djiboutian Franc
      DKK: "kr", // Danish Krone
      DOP: "RD$", // Dominican Peso
      DZD: "دج", // Algerian Dinar
      EGP: "E£", // Egyptian Pound
      ERN: "Nfk", // Eritrean Nakfa
      ETB: "Br", // Ethiopian Birr
      EUR: "€", // Euro
      FJD: "$", // Fijian Dollar
      FKP: "£", // Falkland Islands Pound
      FOK: "HK$", // Falkland Islands Pound
      GBP: "£", // British Pound Sterling
      GEL: "₾", // Georgian Lari
      GGP: "GGP", // Guernsey Pound
      GHS: "GH₵", // Ghanaian Cedi
      GIP: "£", // Gibraltar Pound
      GMD: "D", // Gambian Dalasi
      GNF: "FG", // Guinean Franc
      GTQ: "Q", // Guatemalan Quetzal
      GYD: "$", // Guyanaese Dollar
      HKD: "HK$", // Hong Kong Dollar
      HNL: "L", // Honduran Lempira
      HRK: "kn", // Croatian Kuna
      HTG: "G", // Haitian Gourde
      HUF: "Ft", // Hungarian Forint
      IDR: "Rp", // Indonesian Rupiah
      ILS: "₪", // Israeli New Shekel
      IMP: "IMP", // Isle of Man Pound
      INR: "₹", // Indian Rupee
      IQD: "ع.د", // Iraqi Dinar
      IRR: "﷼", // Iranian Rial
      ISK: "Íkr", // Icelandic Króna
      JEP: "JEP", // Jersey Pound
      JMD: "J$", // Jamaican Dollar
      JOD: "JD", // Jordanian Dinar
      JPY: "¥", // Japanese Yen
      KES: "Ksh", // Kenyan Shilling
      KGS: "с", // Kyrgystani Som
      KHR: "៛", // Cambodian Riel
      KID: "$", // Kiribati Dollar
      KMF: "CF", // Comorian Franc
      KRW: "₩", // South Korean Won
      KWD: "KD", // Kuwaiti Dinar
      KYD: "$", // Cayman Islands Dollar
      KZT: "₸", // Kazakhstani Tenge
      LAK: "₭", // Laotian Kip
      LBP: "ل.ل", // Lebanese Pound
      LKR: "රු", // Sri Lankan Rupee
      LRD: "$", // Liberian Dollar
      LSL: "L", // Lesotho Loti
      LYD: "LD", // Libyan Dinar
      MAD: "MAD", // Moroccan Dirham
      MDL: "MDL", // Moldovan Leu
      MGA: "Ar", // Malagasy Ariary
      MKD: "MKD", // Macedonian Denar
      MMK: "K", // Myanma Kyat
      MNT: "₮", // Mongolian Tugrik
      MOP: "MOP$", // Macanese Pataca
      MRU: "UM", // Mauritanian Ouguiya
      MUR: "₨", // Mauritian Rupee
      MVR: "MVR", // Maldivian Rufiyaa
      MWK: "MK", // Malawian Kwacha
      MXN: "$", // Mexican Peso
      MYR: "RM", // Malaysian Ringgit
      MZN: "MT", // Mozambican Metical
      NAD: "$", // Namibian Dollar
      NGN: "₦", // Nigerian Naira
      NIO: "C$", // Nicaraguan Córdoba
      NOK: "kr", // Norwegian Krone
      NPR: "₨", // Nepalese Rupee
      NZD: "$", // New Zealand Dollar
      OMR: "OMR", // Omani Rial
      PAB: "B/.", // Panamanian Balboa
      PEN: "S/.", // Peruvian Nuevo Sol
      PGK: "K", // Papua New Guinean Kina
      PHP: "₱", // Philippine Peso
      PKR: "₨", // Pakistani Rupee
      PLN: "zł", // Polish Zloty
      PYG: "₲", // Paraguayan Guarani
      QAR: "QR", // Qatari Rial
      RON: "lei", // Romanian Leu
      RSD: "дин", // Serbian Dinar
      RUB: "₽", // Russian Ruble
      RWF: "FR", // Rwandan Franc
      SAR: "SR", // Saudi Riyal
      SBD: "$", // Solomon Islands Dollar
      SCR: "SR", // Seychellois Rupee
      SDG: "SDG", // Sudanese Pound
      SEK: "kr", // Swedish Krona
      SGD: "$", // Singapore Dollar
      SHP: "£", // Saint Helena Pound
      SLL: "Le", // Sierra Leonean Leone
      SOS: "S", // Somali Shilling
      SRD: "$", // Surinamese Dollar
      SSP: "SSP", // South Sudanese Pound
      STN: "Db", // São Tomé and Príncipe Dobra
      SYP: "ل.س", // Syrian Pound
      SZL: "L", // Swazi Lilangeni
      THB: "฿", // Thai Baht
      TJS: "ЅМ", // Tajikistani Somoni
      TMT: "T", // Turkmenistani Manat
      TND: "د.ت", // Tunisian Dinar
      TOP: "T$", // Tongan Pa'anga
      TRY: "₺", // Turkish Lira
      TTD: "TT$", // Trinidad and Tobago Dollar
      TVD: "$", // Tuvaluan Dollar
      TWD: "NT$", // New Taiwan Dollar
      TZS: "TSh", // Tanzanian Shilling
      UAH: "₴", // Ukrainian Hryvnia
      UGX: "USh", // Ugandan Shilling
      USD: "$", // United States Dollar
      UYU: "$", // Uruguayan Peso
      UZS: "лв", // Uzbekistan Som
      VES: "Bs.", // Venezuelan Bolívar
      VND: "₫", // Vietnamese Dong
      VUV: "VT", // Vanuatu Vatu
      WST: "WS$", // Samoan Tala
      XAF: "FCFA", // Central African CFA Franc
      XCD: "$", // East Caribbean Dollar
      XDR: "SDR", // Special Drawing Rights
      XOF: "CFA", // West African CFA Franc
      XPF: "₣", // CFP Franc
      YER: "﷼", // Yemeni Rial
      ZAR: "R", // South African Rand
      ZMW: "ZK", // Zambian Kwacha
      ZWL: "$", // Zimbabwean Dollar
    };

    return (currencySymbols as Record<string, string>)[shortCurrencyCode] || "";
  }
}
