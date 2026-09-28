// Generator script to build src/data/banks.js and src/data/dictionary.js for all 56 languages
const fs = require("fs");
const path = require("path");

function checkUniqueChars(word) {
  const chars = new Set();
  for (const ch of word) {
    if (chars.has(ch)) return false;
    chars.add(ch);
  }
  return true;
}

// Complete 56-language authentic vocabulary bank
const RAW_BANKS = {
  en: {
    animals: ["CAT", "DOG", "FOX", "OWL", "BAT", "RAM", "COW", "HEN", "LION", "BEAR", "WOLF", "HORSE", "ZEBRA", "GOAT", "DUCK", "CRAB", "SEAL", "MOUSE", "SNAKE", "WHALE"],
    food: ["TEA", "PIE", "JAM", "RICE", "SOUP", "BREAD", "CAKE", "LIME", "MILK", "FISH", "SALT", "HONEY", "PEAR", "PLUM", "MANGO", "GRAPE", "YOGURT", "SPICE", "GRAVY"],
    nature: ["SUN", "SKY", "SEA", "ICE", "RAIN", "CLOUD", "STORM", "OCEAN", "FOREST", "GLACIER", "ISLAND", "SPRING", "STAR", "EARTH", "WINTER", "DEW", "FOG", "CAVE"],
    colors: ["RED", "TAN", "GOLD", "PINK", "BLUE", "GRAY", "TEAL", "NAVY", "CORAL", "IVORY", "SILVER", "BRONZE", "AMBER", "JADE", "RUBY", "ONYX", "PEARL", "MAUVE", "UMBER"],
    house: ["BED", "CUP", "FORK", "LAMP", "SOFA", "SHELF", "CHAIR", "TABLE", "CARPET", "GARDEN", "BLANKET", "CABINET", "DESK", "RUG", "VASE", "CURTAIN", "OVEN", "SINK"],
  },
  es: {
    animals: ["GATO", "PATO", "LEON", "CIERVO", "TIGRE", "FOCA", "BUHO", "PEZ", "LINCE", "MULA", "CUERVO", "PUMA", "RATON", "VENADO", "HALCON", "DELFIN"],
    food: ["PAN", "SAL", "MIEL", "QUESO", "CREMA", "FRUTA", "CARNE", "LIMON", "PASTEL", "HUEVO", "SOPA", "DULCE", "MANGO", "UVA", "AJO", "VINO"],
    nature: ["SOL", "MAR", "RIO", "CIELO", "LUNA", "HIELO", "BOSQUE", "MONTE", "ISLA", "NUBE", "VIENTO", "VOLCAN", "SUR", "NORTE"],
    colors: ["GRIS", "AZUL", "ROSA", "CAFE", "CIAN", "OCRE", "CORAL", "PERLA", "NEGRO", "BLANCO", "VIOLETA"],
    house: ["MESA", "MURO", "PISO", "BANCO", "LIBRO", "TECHO", "PUERTA", "JARDIN", "CUADRO", "CORTINA", "PATIO", "BALCON"],
  },
  fr: {
    animals: ["CHAT", "CHIEN", "LOUP", "OURS", "LION", "CHEVAL", "TIGRE", "SINGE", "PIGEON", "LAPIN", "REQUIN", "DAUPHIN"],
    food: ["PAIN", "LAIT", "MIEL", "RIZ", "SEL", "FROMAGE", "POIVRE", "SUCRE", "SOUPE", "VIANDE", "POIRE", "CITRON", "OEUF"],
    nature: ["MER", "CIEL", "LUNE", "GLACE", "FORET", "PLUIE", "NUAGE", "ILE", "VENT", "SABLE", "VOLCAN", "HIVER"],
    colors: ["GRIS", "BLEU", "VERT", "ROSE", "NOIR", "DORE", "ROUGE", "BLANC", "ARGENT", "VIOLET", "CUIVRE"],
    house: ["LIT", "MUR", "BANC", "LAMPE", "TAPIS", "TABLE", "PORTE", "CHAISE", "JARDIN", "RIDEAU", "BALCON"],
  },
  de: {
    animals: ["HUND", "WOLF", "HASE", "BAER", "LOEWE", "TIGER", "FUCHS", "SCHAF", "KATZE", "PFERD", "MAUS", "DELFIN"],
    food: ["OBST", "SALZ", "KAESE", "REIS", "MILCH", "HONIG", "FISCH", "KUCHEN", "ZUCKER", "BROT", "BIRNE", "TRAUBE"],
    nature: ["EIS", "WIND", "MOND", "WALD", "BERG", "FELS", "STERN", "INSEL", "WOLKE", "STRAND", "VULKAN", "WINTER", "HERBST"],
    colors: ["ROT", "BLAU", "GRUEN", "GELB", "GRAU", "ROSA", "BRAUN", "SILBER", "GOLD", "TUERKIS", "KUPFER"],
    house: ["SOFA", "TISCH", "STUHL", "TUER", "GARTEN", "LAMPE", "REGAL", "VORHANG", "DACH", "WAND", "BALKON"],
  },
  ar: {
    animals: ["قطة", "كلب", "أسد", "ثعلب", "ذئب", "حصان", "فيل", "نمر", "أرنب", "قرد", "زرافة", "جمل", "غزال"],
    food: ["خبز", "حليب", "عسل", "أرز", "ملح", "جبن", "سمك", "لحم", "تفاح", "موز", "عنب", "برتقال"],
    nature: ["شمس", "بحر", "قمر", "ثلج", "غيم", "جبل", "نهر", "غابة", "جزيرة", "ريح", "بركان", "صحراء", "شتاء"],
    colors: ["أحمر", "أزرق", "أخضر", "أصفر", "أبيض", "أسود", "بني", "وردي", "ذهبي", "فضي", "بنفسجي"],
    house: ["شباك", "طاولة", "كرسي", "مطبخ", "حديقة", "مصباح", "سقف", "جدار", "ستارة", "رف", "شرفة"],
  },
  ur: {
    animals: ["بلی", "کتا", "شیر", "لومڑی", "گھوڑا", "ہاتھی", "بندر", "خرگوش", "گائے", "مرغی", "زرافہ", "اونٹ"],
    food: ["روٹی", "نمک", "شہد", "چاول", "پنیر", "مچھلی", "گوشت", "سیب", "کیلا", "آٹا", "انگور", "سنترہ"],
    nature: ["سورج", "سمندر", "چاند", "برف", "بادل", "پہاڑ", "دریا", "جنگل", "جزیرہ", "ہوا", "صحرا", "سردی"],
    colors: ["سرخ", "نیلا", "سبز", "پیلا", "سفید", "سیاہ", "گلابی", "سنہرا", "چاندی", "جامنی", "بھورا"],
    house: ["میز", "دروازہ", "چراغ", "باغ", "چھت", "دیوار", "پردہ", "بستر", "صحن", "بالکونی"],
  },
  pt: {
    animals: ["GATO", "PATO", "LEAO", "FOCA", "URSO", "LOBO", "ZEBRA", "RATO", "TIGRE", "COBRA", "PEIXE", "PUMA", "CERVO", "PERU", "MULA"],
    food: ["PAO", "SAL", "MEL", "ARROZ", "SOPA", "BIFE", "PERA", "UVA", "LIMAO", "FIGO", "DOCE", "NOZ", "CAFE", "CHURRO"],
    nature: ["SOL", "MAR", "RIO", "CEU", "LUA", "GELO", "NUVEM", "PRAIA", "VENTO", "ILHA", "MONTE", "DUNAS", "VALE"],
    colors: ["AZUL", "ROSA", "ROXO", "CINZA", "OURO", "PRATA", "PRETO", "VERDE", "BEGE", "BRANCO"],
    house: ["MESA", "CAMA", "PORTA", "MURO", "CHAO", "TETO", "SALA", "COPA", "FOGAO", "VASO", "BANHO"],
  },
  it: {
    animals: ["CANE", "LUPO", "ORSO", "LEONE", "TIGRE", "VOLPE", "CERVO", "RANA", "PESCE", "FOCA", "MULO", "GATTO", "TOPO"],
    food: ["PANE", "RISO", "MIELE", "SALE", "PERA", "MELA", "PESCA", "VINO", "NOCE", "UOVO", "OLIO", "FICO", "SUGO"],
    nature: ["SOLE", "MARE", "CIELO", "LUNA", "NEVE", "VENTO", "ISOLA", "MONTE", "FIUME", "PRATO", "BOSCO", "LAGO"],
    colors: ["NERO", "ROSA", "BLU", "ORO", "OCRA", "VIOLA", "BEIGE", "BIANCO", "GRIGIO", "VERDE"],
    house: ["CASA", "MURO", "PORTA", "TETTO", "VASO", "DIVANO", "BAGNO", "SCALA", "FORNO", "ORTO"],
  },
  nl: {
    animals: ["HOND", "KAT", "VOS", "WOLF", "HERT", "VIS", "DUIF", "ZWAAN", "BEER", "TIJGER", "PAARD", "MUIS", "HAAS"],
    food: ["BROOD", "RIJST", "HONING", "ZOUT", "PEER", "DRUIF", "MELK", "SOEP", "THEE", "VIS", "KAAS", "VLEES"],
    nature: ["ZON", "ZEE", "MAAN", "WIND", "BERG", "ROTS", "STER", "EILAND", "WOLK", "STRAND", "BOS", "LOPEN"],
    colors: ["ROOD", "BLAUW", "GEEL", "GRIJS", "ROZE", "BRUIN", "GOUD", "ZILVER", "WIT", "ZWART"],
    house: ["HUIS", "DEUR", "TAFEL", "STOEL", "LAMP", "TUIN", "DAK", "MUUR", "BANK", "RAAM", "VLOER"],
  },
  pl: {
    animals: ["KOT", "PIES", "LIS", "WILK", "SOWA", "RYBA", "KRUK", "LEW", "ZUBR", "DZIK", "KOZA", "KRET"],
    food: ["CHLEB", "RYZ", "MIOD", "SOL", "ZUPA", "SER", "JAJKO", "OWOC", "KASZA", "WODA", "SOK"],
    nature: ["SLONCE", "MORZE", "NIEBO", "WIATR", "GORA", "SKALA", "GWIAZDA", "WYSPA", "CHMURA", "LAS", "RZEKA"],
    colors: ["BIEL", "SZARY", "ZOLTY", "SINY", "ROZ", "BRAZ", "ZLOTY", "SREBRNY", "CZARNY"],
    house: ["DOM", "STOL", "DRZWI", "DACH", "OKNO", "LAMPA", "OGROD", "POKOJ", "LOZKO", "SCIANA"],
  },
  ro: {
    animals: ["LUP", "URS", "LEU", "CAL", "CERB", "PESTE", "VULPE", "PISICA", "SOAREC", "CAINE", "RATON"],
    food: ["PAINE", "OREZ", "MIERE", "SARE", "SUPA", "BRANZA", "FRUCT", "CARNE", "MAR", "PARA", "VIN"],
    nature: ["SOARE", "MARE", "CER", "LUNA", "VANT", "MUNTE", "STELE", "INSULA", "NOR", "PADURE", "RAU"],
    colors: ["ALB", "NEGRU", "GRI", "ROZ", "AZUR", "AURIU", "ARGINT", "BRUN", "VERDE"],
    house: ["CASA", "MASA", "USA", "ACOPERIS", "CAMERA", "LAMPA", "GRADINA", "SALA", "PAT", "PERETE"],
  },
  cs: {
    animals: ["PES", "VLK", "LISKA", "LEV", "KUN", "RYBA", "JELEK", "KOCKA", "MEDVED", "ZAJIC", "SOVA"],
    food: ["CHLEB", "RYZE", "MED", "SOL", "POLEVKA", "SYR", "OVOCE", "MASO", "JABLKO", "HRUSKA", "VINO"],
    nature: ["SLUNCE", "MORE", "NEBE", "MESIC", "VITR", "HORA", "SKALA", "HVEZDA", "OSTROV", "OBLAK", "LES"],
    colors: ["BILA", "CERNA", "SEDA", "RUZOVA", "ZUTA", "ZLATY", "STRIBRNY", "HNEDA"],
    house: ["DUM", "STUL", "DVERE", "STRECHA", "POKOJ", "LAMPA", "ZAHRADA", "ZEĎ", "POSTEL"],
  },
  sv: {
    animals: ["HUND", "KATT", "VARG", "LEJON", "TIGER", "FISK", "BJÖRN", "HAST", "MUS", "HAR", "UGGLA"],
    food: ["BROD", "RIS", "HONUNG", "SALT", "SOPPA", "OST", "FRUKT", "KOTT", "PARON", "VIN", "MJOLK"],
    nature: ["SOL", "HAV", "HIMMEL", "MANE", "VIND", "BERG", "STJARNA", "O", "MOLN", "SKOG", "SJO"],
    colors: ["VIT", "SVART", "GRA", "ROSA", "GUL", "GULD", "SILVER", "BRUN", "BLA"],
    house: ["HUS", "BORD", "DORR", "TAK", "RUM", "LAMPA", "TRADGARD", "VAGG", "SANG"],
  },
  no: {
    animals: ["HUND", "KATT", "ULV", "LØVE", "TIGER", "FISK", "BJØRN", "HEST", "MUS", "HARE", "UGLE"],
    food: ["BRØD", "RIS", "HONNING", "SALT", "SUPPE", "OST", "FRUKT", "KJØTT", "PÆRE", "VIN", "MELK"],
    nature: ["SOL", "HAV", "HIMMEL", "MÅNE", "VIND", "FJELL", "STJERNE", "ØY", "SKY", "SKOG", "SJØ"],
    colors: ["HVIT", "SVART", "GRÅ", "ROSA", "GUL", "GULL", "SØLV", "BRUN", "BLÅ"],
    house: ["HUS", "BORD", "DØR", "TAK", "ROM", "LAMPE", "HAGE", "VEGG", "SENG"],
  },
  da: {
    animals: ["HUND", "KAT", "ULV", "LØVE", "TIGER", "FISK", "BJØRN", "HEST", "MUS", "HARE", "UGLE"],
    food: ["BRØD", "RIS", "HONNING", "SALT", "SUPPE", "OST", "FRUGT", "KØD", "PÆRE", "VIN", "MÆLK"],
    nature: ["SOL", "HAV", "HIMMEL", "MÅNE", "VIND", "BJERGE", "STJERNE", "Ø", "SKY", "SKOV", "SØ"],
    colors: ["HVID", "SORT", "GRÅ", "PINK", "GUL", "GULD", "SØLV", "BRUN", "BLÅ"],
    house: ["HUS", "BORD", "DØR", "TAG", "VÆRELSE", "LAMPE", "HAVE", "VÆG", "SENG"],
  },
  fi: {
    animals: ["SUSI", "KARHU", "LEIJONA", "TIIKERI", "KALA", "HEVONEN", "HIIRI", "JÄNIS", "PÖLLÖ", "KOIRA", "KISSA"],
    food: ["LEIPÄ", "RIISI", "HUNAJA", "SUOLA", "KEITTO", "JUUSTO", "HEDELMÄ", "LIHA", "PÄÄRYNÄ", "VIINI", "MAITO"],
    nature: ["AURINKO", "MERI", "TAIVAS", "KUU", "TUULI", "VUORI", "TÄHTI", "SAARI", "PILVI", "METSÄ", "JÄRVI"],
    colors: ["VALKOINEN", "MUSTA", "HARMAA", "PUNAINEN", "KELTAINEN", "KULTA", "HOPEA", "RUSKEA", "SININEN"],
    house: ["TALO", "PÖYTÄ", "OVI", "KATTO", "HUONE", "LAMPPU", "PUUTARHA", "SEINÄ", "SÄNKY"],
  },
  el: {
    animals: ["ΛΥΚΟΣ", "ΛΙΟΝΤΑΡΙ", "ΤΙΓΡΗΣ", "ΨΑΡΙ", "ΑΛΟΓΟ", "ΑΡΚΟΥΔΑ", "ΠΟΝΤΙΚΙ", "ΛΑΓΟΣ", "ΚΟΥΚΟΥΒΑΓΙΑ"],
    food: ["ΨΩΜΙ", "ΡΥΖΙ", "ΜΕΛΙ", "ΑΛΑΤΙ", "ΣΟΥΠΑ", "ΤΥΡΙ", "ΦΡΟΥΤΟ", "ΚΡΕΑΣ", "ΑΧΛΑΔΙ", "ΚΡΑΣΙ", "ΓΑΛΑ"],
    nature: ["ΗΛΙΟΣ", "ΘΑΛΑΣΣΑ", "ΟΥΡΑΝΟΣ", "ΦΕΓΓΑΡΙ", "ΑΝΕΜΟΣ", "ΒΟΥΝΟ", "ΑΣΤΕΡΙ", "ΝΗΣΙ", "ΣΥΝΝΕΦΟ", "ΔΑΣΟΣ"],
    colors: ["ΛΕΥΚΟ", "ΜΑΥΡΟ", "ΓΚΡΙ", "ΚΟΚΚΙΝΟ", "ΚΙΤΡΙΝΟ", "ΧΡΥΣΟ", "ΑΣΗΜΙ", "ΚΑΦΕ", "ΜΠΛΕ"],
    house: ["ΣΠΙΤΙ", "ΤΡΑΠΕΖΙ", "ΠΟΡΤΑ", "ΣΤΕΓΗ", "ΔΩΜΑΤΙΟ", "ΛΑΜΠΑ", "ΚΗΠΟΣ", "ΤΟΙΧΟΣ", "ΚΡΕΒΑΤΙ"],
  },
  hu: {
    animals: ["FARKAS", "OROSZLAN", "TIGRIS", "HAL", "LO", "MEDVE", "EGER", "NYUL", "BAGOLY", "KUTYA", "MACSKA"],
    food: ["KENYER", "RIZS", "MEZ", "SO", "LEVES", "SAJT", "GYUMOLCS", "HUS", "KORTE", "BOR", "TEJ"],
    nature: ["NAP", "TENGER", "EG", "HOLD", "SZEL", "HEGY", "CSILLAG", "SZIGET", "FELHO", "ERDO", "TO"],
    colors: ["FEHER", "FEKETE", "SZURKE", "PIROS", "SARGA", "ARANY", "EZUST", "BARNA", "KEK"],
    house: ["HAZ", "ASZTAL", "AJTO", "TETO", "SZOBA", "LAMPA", "KERT", "FAL", "AGY"],
  },
  tr: {
    animals: ["KURT", "ASLAN", "KAPLAN", "BALIK", "AT", "AYI", "FARE", "TAVSAN", "BAYKUS", "KOPEK", "KEDI"],
    food: ["EKMEK", "PIRINC", "BAL", "TUZ", "CORBA", "PEYNIR", "MEYVE", "ET", "ARMUT", "SARAP", "SUT"],
    nature: ["GUNES", "DENIZ", "GOKYUZU", "AY", "RUZGAR", "DAG", "YILDIZ", "ADA", "BULUT", "ORMAN", "GOL"],
    colors: ["BEYAZ", "SIYAH", "GRI", "KIRMIZI", "SARI", "ALTIN", "GUMUS", "KAHVE", "MAVI"],
    house: ["EV", "MASA", "KAPI", "CATI", "ODA", "LAMBA", "BAHCE", "DUVAR", "YATAK"],
  },
  uk: {
    animals: ["ВОВК", "ЛЕВ", "ТИГР", "РИБА", "КІНЬ", "ВЕДМІДЬ", "МИША", "ЗАЄЦЬ", "СОВА", "СОБАКА", "КІТ"],
    food: ["ХЛІБ", "РИС", "МЕД", "СІЛЬ", "СУП", "СИР", "ФРУКТ", "М'ЯСО", "ГРУША", "ВИНО", "МОЛОКО"],
    nature: ["СОНЦЕ", "МОРЕ", "НЕБО", "МІСЯЦЬ", "ВІТЕР", "ГОРА", "ЗІРКА", "ОСТРІВ", "ХМАРА", "ЛІС", "ОЗЕРО"],
    colors: ["БІЛИЙ", "ЧОРНИЙ", "СІРИЙ", "ЧЕРВОНИЙ", "ЖОВТИЙ", "ЗОЛОТО", "СРІБЛО", "КОРИЧНЕВИЙ", "СИНІЙ"],
    house: ["ДІМ", "СТІЛ", "ДВЕРІ", "ДАХ", "КІМНАТА", "ЛАМПА", "САД", "СТІНА", "ЛІЖКО"],
  },
  ru: {
    animals: ["ВОЛК", "ЛЕВ", "ТИГР", "РЫБА", "КОНЬ", "МЕДВЕДЬ", "МЫШЬ", "ЗАЯЦ", "СОВА", "СОБАКА", "КОТ"],
    food: ["ХЛЕБ", "РИС", "МЕД", "СОЛЬ", "СУП", "СЫР", "ФРУКТ", "МЯСО", "ГРУША", "ВИНО", "МОЛОКО"],
    nature: ["СОЛНЦЕ", "МОРЕ", "НЕБО", "ЛУНА", "ВЕТЕР", "ГОРА", "ЗВЕЗДА", "ОСТРОВ", "ОБЛАКО", "ЛЕС", "ОЗЕРО"],
    colors: ["БЕЛЫЙ", "ЧЕРНЫЙ", "СЕРЫЙ", "КРАСНЫЙ", "ЖЕЛТЫЙ", "ЗОЛОТО", "СЕРЕБРО", "КОРИЧНЕВЫЙ", "СИНИЙ"],
    house: ["ДОМ", "СТОЛ", "ДВЕРЬ", "КРЫША", "КОМНАТА", "ЛАМПА", "САД", "СТЕНА", "КРОВАТЬ"],
  },
  bg: {
    animals: ["ВЪЛК", "ЛЪВ", "ТИГЪР", "РИБА", "КОН", "МЕЧКА", "МИШКА", "ЗАЕК", "БУХАЛ", "КУЧЕ", "КОТКА"],
    food: ["ХЛЯБ", "ОРИЗ", "МЕД", "СОЛ", "СУПА", "СИРЕНЕ", "ПЛОД", "МЕСО", "КРУША", "ВИНО", "МЛЯКО"],
    nature: ["СЛЪНЦЕ", "МОРЕ", "НЕБЕ", "ЛУНА", "ВЯТЪР", "ПЛАНИНА", "ЗВЕЗДА", "ОСТРОВ", "ОБЛАК", "ГОРА", "ЕЗЕРО"],
    colors: ["БЯЛ", "ЧЕРЕН", "СИВ", "ЧЕРВЕН", "ЖЪЛТ", "ЗЛАТО", "СРЕБРО", "КАФЯВ", "СИН"],
    house: ["ДОМ", "МАСА", "ВРАТА", "ПОКРИВ", "СТАЯ", "ЛАМПА", "ГРАДИНА", "СТЕНА", "ЛЕГЛО"],
  },
  hr: {
    animals: ["VUK", "LAV", "TIGAR", "RIBA", "KONJ", "MEDVJED", "MIS", "ZEC", "SOVA", "PAS", "MACKA"],
    food: ["KRUH", "RIZA", "MED", "SOL", "JUHA", "SIR", "VOCE", "MESO", "KRUSKA", "VINO", "MLIJEKO"],
    nature: ["SUNCE", "MORE", "NEBO", "MJESEC", "VJETAR", "PLANINA", "ZVIJEZDA", "OTOK", "OBLAK", "SUMA", "JEZERO"],
    colors: ["BIJELA", "CRNA", "SIVA", "CRVENA", "ZUTA", "ZLATO", "SREBRO", "SMEDA", "PLAVA"],
    house: ["KUCA", "STOL", "VRATA", "KROV", "SOBA", "LAMPA", "VRT", "ZID", "KREVET"],
  },
  sr: {
    animals: ["ВУК", "ЛАВ", "ТИГАР", "РИБА", "КОЊ", "МЕДВЕД", "МИШ", "ЗЕЦ", "СОВА", "ПАС", "МАЧКА"],
    food: ["ХЛЕБ", "ПИРИНАЧ", "МЕД", "СО", "СУПА", "СИР", "ВОЋЕ", "МЕСО", "КРУШКА", "ВИНО", "МЛЕКО"],
    nature: ["СУНЦЕ", "МОРЕ", "НЕБО", "МЕСЕЦ", "ВЕТАР", "ПЛАНИНА", "ЗВЕЗДА", "ОСТРВО", "ОБЛАК", "ШУМА", "ЈЕЗЕРО"],
    colors: ["БЕЛА", "ЦРНА", "СИВА", "ЦРВЕНА", "ЖУТА", "ЗЛАТО", "СРЕБРО", "БРАОН", "ПЛАВА"],
    house: ["КУЋА", "СТО", "ВРАТА", "КРОВ", "СОБА", "ЛАМПА", "БАШТА", "ЗИД", "КРЕВЕТ"],
  },
  sk: {
    animals: ["VLK", "LEV", "TIGER", "RYBA", "KON", "MEDVED", "MYS", "ZAJAC", "SOVA", "PES", "MACKA"],
    food: ["CHLIEB", "RYZA", "MED", "SOL", "POLIEVKA", "SYR", "OVOCIE", "MASO", "HRUSKA", "VINO", "MLIEKO"],
    nature: ["SLNKO", "MORE", "NEBO", "MESIAC", "VIETOR", "HORA", "HVIEZDA", "OSTROV", "OBLAK", "LES", "JAZERO"],
    colors: ["BIELA", "CIERNA", "SEDA", "CERVENA", "ZLTA", "ZLATO", "STRIEBRO", "HNEDA", "MODRA"],
    house: ["DOM", "STOL", "DVERE", "STRECHA", "IZBA", "LAMPA", "ZAHRADA", "STENA", "POSTEL"],
  },
  ca: {
    animals: ["LLOP", "LLEO", "TIGRE", "PEIX", "CAVALL", "OS", "RATOLI", "LLEBRE", "GUS", "GOS", "GAT"],
    food: ["PA", "ARROS", "MEL", "SAL", "SOPA", "FORMATGE", "FRUITA", "CARN", "PERA", "VI", "LLET"],
    nature: ["SOL", "MAR", "CEL", "LLUNA", "VENT", "MUNTANYA", "ESTEL", "ILLA", "NUVOL", "BOSC", "LLAC"],
    colors: ["BLANC", "NEGRE", "GRIS", "VERMELL", "GROC", "OR", "PLATA", "MARRO", "BLAU"],
    house: ["CASA", "TAULA", "PORTA", "TEULAT", "HABITACIO", "LLUM", "JARDÍ", "PARET", "LLIT"],
  },
  zh: {
    animals: ["猫", "狗", "狐", "狼", "熊", "狮", "虎", "马", "鹿", "鸟", "鱼", "兔", "象", "羊", "牛"],
    food: ["茶", "米", "饭", "汤", "肉", "菜", "盐", "糖", "面", "蜜", "酒", "果", "梨", "油", "蛋"],
    nature: ["日", "月", "星", "云", "风", "雨", "山", "海", "江", "林", "雪", "冰", "石", "川", "天"],
    colors: ["红", "黄", "蓝", "绿", "白", "黑", "紫", "青", "金", "银", "灰", "橙", "棕", "粉"],
    house: ["门", "窗", "床", "桌", "椅", "灯", "房", "墙", "庭", "楼", "瓦", "梯", "院", "帘"],
  },
  "zh-TW": {
    animals: ["貓", "狗", "狐", "狼", "熊", "獅", "虎", "馬", "鹿", "鳥", "魚", "兔", "象", "羊", "牛"],
    food: ["茶", "米", "飯", "湯", "肉", "菜", "鹽", "糖", "麵", "蜜", "酒", "果", "梨", "油", "蛋"],
    nature: ["日", "月", "星", "雲", "風", "雨", "山", "海", "江", "林", "雪", "冰", "石", "川", "天"],
    colors: ["紅", "黃", "藍", "綠", "白", "黑", "紫", "青", "金", "銀", "灰", "橙", "棕", "粉"],
    house: ["門", "窗", "床", "桌", "椅", "燈", "房", "牆", "庭", "樓", "瓦", "梯", "院", "簾"],
  },
  ja: {
    animals: ["ネコ", "イヌ", "トラ", "シカ", "トリ", "サカナ", "サル", "ウマ", "ウシ", "ヒツジ", "クマ", "ゾウ", "ワシ"],
    food: ["チャ", "コメ", "パン", "スープ", "ニク", "シオ", "サトウ", "ミツ", "サケ", "ナシ", "タマゴ", "アブラ"],
    nature: ["ヒ", "ツキ", "ホシ", "クモ", "カゼ", "アメ", "ヤマ", "ウミ", "モリ", "ユキ", "コオリ", "イシ", "ソラ"],
    colors: ["アカ", "アオ", "シロ", "クロ", "キイロ", "ミドリ", "ムラサキ", "キン", "ギン", "ハイ"],
    house: ["ドア", "マド", "ベッド", "ツクエ", "イス", "ランプ", "ヘヤ", "カベ", "ニワ", "ヤネ", "カイダン"],
  },
  ko: {
    animals: ["고양이", "개", "늑대", "호랑이", "말", "사슴", "새", "물고기", "곰", "소", "양", "코끼리", "원숭이"],
    food: ["차", "쌀", "밥", "국", "고기", "소금", "설탕", "꿀", "술", "배", "계란", "기름"],
    nature: ["해", "달", "별", "구름", "바람", "비", "산", "바다", "숲", "눈", "얼음", "돌", "하늘"],
    colors: ["빨강", "파랑", "하양", "검정", "노랑", "초록", "보라", "금색", "은색", "회색"],
    house: ["문", "창문", "침대", "책상", "의자", "램프", "방", "벽", "마당", "지붕", "계단"],
  },
  hi: {
    animals: ["शेर", "बाघ", "घोड़ा", "हिरण", "पक्षी", "मछली", "भालू", "बैल", "भेड़", "हाथी", "बंदर", "कुत्ता", "बिल्ली"],
    food: ["चाय", "चावल", "रोटी", "सूप", "मांस", "नमक", "चीनी", "शहद", "शराब", "नाशपाती", "अंडा", "तेल"],
    nature: ["सूर्य", "चंद्र", "तारा", "बादल", "हवा", "वर्षा", "पर्वत", "समुद्र", "वन", "बर्फ", "पत्थर", "आकाश"],
    colors: ["लाल", "नीला", "सफेद", "काला", "पीला", "हरा", "बैंगनी", "सुनहरा", "चांदी", "धूसर"],
    house: ["दरवाजा", "खिड़की", "बिस्तर", "मेज", "कुर्सी", "दीपक", "कमरा", "दीवार", "बगीचा", "छत"],
  },
  bn: {
    animals: ["সিংহ", "বাঘ", "ঘোড়া", "হরিণ", "পাখি", "মাছ", "ভালুক", "গরু", "ভেড়া", "হাতি", "বানর", "কুকুর", "বিড়াল"],
    food: ["চা", "চাল", "রুটি", "স্যুপ", "মাংস", "লবণ", "চিনি", "মধু", "মদ", "নাশপাতি", "ডিম", "তেল"],
    nature: ["সূর্য", "চাঁদ", "তারা", "মেঘ", "বাতাস", "বৃষ্টি", "পাহাড়", "সমুদ্র", "বন", "বরফ", "পাথর", "আকাশ"],
    colors: ["লাল", "নীল", "সাদা", "কালো", "হলুদ", "সবুজ", "বেগুনি", "সোনালী", "রূপালী", "ধূসর"],
    house: ["দরজা", "জানালা", "বিছানা", "টেবিল", "চেয়ার", "প্রদীপ", "ঘর", "দেয়াল", "বাগান", "ছাদ"],
  },
  ta: {
    animals: ["சிங்கம்", "புலி", "குதிரை", "மான்", "பறவை", "மீன்", "கரடி", "மாடு", "ஆடு", "யானை", "குரங்கு", "நாய்", "பூனை"],
    food: ["தேநீர்", "அரிசி", "ரொட்டி", "சூப்", "இறைச்சி", "உப்பு", "சர்க்கரை", "தேன்", "மது", "முட்டை", "எண்ணெய்"],
    nature: ["சூரியன்", "நிலா", "நட்சத்திரம்", "மேகம்", "காற்று", "மழை", "மலை", "கடல்", "காடு", "பனி", "கல்", "வானம்"],
    colors: ["சிவப்பு", "நீலம்", "வெள்ளை", "கருப்பு", "மஞ்சள்", "பச்சை", "தங்கம்", "வெள்ளி", "சாம்பல்"],
    house: ["கதவு", "ஜன்னல்", "படுக்கை", "மேசை", "நாற்காலி", "விளக்கு", "அறை", "சுவர்", "தோட்டம்", "கூரை"],
  },
  te: {
    animals: ["సింహం", "పులి", "గుర్రం", "జింక", "పక్షి", "చేప", "ఎలుగుబంటి", "ఆవు", "గొర్రె", "ఏనుగు", "కోతి", "కుక్క", "పిల్లి"],
    food: ["టీ", "బియ్యం", "రొట్టె", "సూప్", "మాంసం", "ఉప్పు", "చక్కెర", "తేనె", "మద్యం", "గుడ్డు", "నూనె"],
    nature: ["సూర్యుడు", "చంద్రుడు", "నక్షత్రం", "మేఘం", "గాలి", "వర్షం", "పర్వతం", "సముద్రం", "అడవి", "మంచు", "రాయి", "ఆకాశం"],
    colors: ["ఎరుపు", "నీలం", "తెలుపు", "నలుపు", "పసుపు", "ఆకుపచ్చ", "బంగారం", "వెండి", "బూడిద"],
    house: ["తలుపు", "కిటికీ", "మంచం", "టేబుల్", "కుర్చీ", "దీపం", "గది", "గోడ", "తోట", "పైకప్పు"],
  },
  th: {
    animals: ["สิงโต", "เสือ", "ม้า", "กวาง", "นก", "ปลา", "หมี", "วัว", "แกะ", "ช้าง", "ลิง", "สุนัข", "แมว"],
    food: ["ชา", "ข้าว", "ขนมปัง", "ซุป", "เนื้อ", "เกลือ", "น้ำตาล", "น้ำผึ้ง", "สุรา", "ไข่", "น้ำมัน"],
    nature: ["ดวงอาทิตย์", "ดวงจันทร์", "ดาว", "เมฆ", "ลม", "ฝน", "ภูเขา", "ทะเล", "ป่า", "หิมะ", "หิน", "ฟ้า"],
    colors: ["แดง", "น้ำเงิน", "ขาว", "ดำ", "เหลือง", "เขียว", "ทอง", "เงิน", "เทา"],
    house: ["ประตู", "หน้าต่าง", "เตียง", "โต๊ะ", "เก้าอี้", "โคมไฟ", "ห้อง", "ผนัง", "สวน", "หลังคา"],
  },
  vi: {
    animals: ["CHO", "MEO", "SU TU", "HO", "NGUA", "NAI", "CHIM", "CA", "GAU", "BO", "CUU", "VOI", "KHI"],
    food: ["TRA", "COM", "BANH", "SUP", "THIT", "MUOI", "DUONG", "MAT", "RUOU", "TRUNG", "DAU"],
    nature: ["MAT TROI", "MAT TRANG", "SAO", "MAY", "GIO", "MUA", "NUI", "BIEN", "RUNG", "TUYET", "DA", "TROI"],
    colors: ["DO", "XANH", "TRANG", "DEN", "VANG", "LUC", "VANG KIM", "BAC", "XAM"],
    house: ["CUA", "CUA SO", "GIUONG", "BAN", "GHE", "DEN", "PHONG", "TUONG", "VUON", "MAI"],
  },
  id: {
    animals: ["SINGA", "HARIMAU", "KUDA", "RUSA", "BURUNG", "IKAN", "BERUANG", "SAPI", "DOMBA", "GAJAH", "MONYET", "ANJING", "KUCING"],
    food: ["TEH", "BERAS", "ROTI", "SUP", "DAGING", "GARAM", "GULA", "MADU", "ANGGUR", "TELUR", "MINYAK"],
    nature: ["MATAHARI", "BULAN", "BINTANG", "AWAN", "ANGIN", "HUJAN", "GUNUNG", "LAUT", "HUTAN", "SALJU", "BATU", "LANGIT"],
    colors: ["MERAH", "BIRU", "PUTIH", "HITAM", "KUNING", "HIJAU", "EMAS", "PERAK", "ABU"],
    house: ["PINTU", "JENDELA", "KASUR", "MEJA", "KURSI", "LAMPU", "KAMAR", "DINDING", "TAMAN", "ATAP"],
  },
  ms: {
    animals: ["SINGA", "HARIMAU", "KUDA", "RUSA", "BURUNG", "IKAN", "BERUANG", "LEMBU", "BIRI", "GAJAH", "MONYET", "ANJING", "KUCING"],
    food: ["TEH", "BERAS", "ROTI", "SUP", "DAGING", "GARAM", "GULA", "MADU", "ANGGUR", "TELUR", "MINYAK"],
    nature: ["MATAHARI", "BULAN", "BINTANG", "AWAN", "ANGIN", "HUJAN", "GUNUNG", "LAUT", "HUTAN", "SALJI", "BATU", "LANGIT"],
    colors: ["MERAH", "BIRU", "PUTIH", "HITAM", "KUNING", "HIJAU", "EMAS", "PERAK", "KELABU"],
    house: ["PINTU", "TINGKAP", "KATIL", "MEJA", "KERUSI", "LAMPU", "BILIK", "DINDING", "TAMAN", "BUMBUNG"],
  },
  tl: {
    animals: ["LEON", "TIGRE", "KABAYO", "USA", "IBON", "ISDA", "OSO", "BAKA", "TUPA", "ELEPANTE", "UNGGOY", "ASO", "PUSA"],
    food: ["TSAA", "BIGAS", "TINAPAY", "SABAW", "KARNE", "ASIN", "ASUKAL", "PULOT", "ALAK", "ITLOG", "MANTIKA"],
    nature: ["ARAW", "BUWAN", "BITUIN", "ULAP", "HANGIN", "ULAN", "BUNDOK", "DAGAT", "GUBAT", "NIYEBE", "BATO", "LANGIT"],
    colors: ["PULA", "ASUL", "PUTI", "ITIM", "DILAW", "BERDE", "GINTO", "PILAK", "ABO"],
    house: ["PINTO", "BINTANA", "KAMA", "LAMESA", "UPUAN", "ILAW", "KWARTO", "PACHIR", "HALAMAN", "BUBONG"],
  },
  my: {
    animals: ["ခြင်္သေ့", "ကျား", "မြင်း", "သမင်", "ငှက်", "ငါး", "ဝက်ဝံ", "နွား", "သိုး", "ဆင်", "မျောက်", "ခွေး", "ကြောင်"],
    food: ["လက်ဖက်ရည်", "ဆန်", "မုန့်", "ဟင်းချို", "အသား", "ဆား", "သကြား", "ပျားရည်", "အရက်", "ဥ", "ဆီ"],
    nature: ["နေ", "လ", "ကြယ်", "တိမ်", "လေ", "မိုး", "တောင်", "ပင်လယ်", "တော", "နှင်း", "ကျောက်", "မိုးကောင်းကင်"],
    colors: ["အနီ", "အပြာ", "အဖြူ", "အနက်", "အဝါ", "အစိမ်း", "ရွှေ", "ငွေ", "မီးခိုး"],
    house: ["တံခါး", "ပြတင်းပေါက်", "အိပ်ရာ", "စားပွဲ", "ကုလားထိုင်", "မီးအိမ်", "အခန်း", "နံရံ", "ဥယျာဉ်", "ခေါင်မိုး"],
  },
  km: {
    animals: ["តោ", "ខ្លា", "សេះ", "ក្ដាន់", "បក្សី", "ត្រី", "ខ្លាឃ្មុំ", "គោ", "ចៀម", "ដំរី", "ស្វា", "ឆ្កែ", "ឆ្មា"],
    food: ["តែ", "អង្ករ", "នំបុ័ង", "ស៊ុប", "សាច់", "អំបិល", "ស្ករ", "ទឹកឃ្មុំ", "ស្រា", "ស៊ុត", "ប្រេង"],
    nature: ["ព្រះអាទិត្យ", "ព្រះច័ន្ទ", "ផ្កាយ", "ពពក", "ខ្យល់", "ភ្លៀង", "ភ្នំ", "សមុទ្រ", "ព្រៃ", "ព្រិល", "ថ្ម", "មេឃ"],
    colors: ["ក្រហម", "ខៀវ", "ស", "ខ្មៅ", "លឿង", "បៃតង", "មាស", "ប្រាក់", "ប្រផេះ"],
    house: ["ទ្វារ", "បង្អួច", "គ្រែ", "តុ", "កៅអី", "ចង្កៀង", "បន្ទប់", "ជញ្ជាំង", "សួន", "ដំបូល"],
  },
  si: {
    animals: ["සිංහයා", "කොටියා", "අශ්වයා", "මුවා", "කුරුල්ලා", "මාළුවා", "වලසා", "හරකා", "බැටළුවා", "අලියා", "වඳුරා", "බල්ලා", "බළලා"],
    food: ["තේ", "සහල්", "පාන්", "සුප්", "මස්", "ලුණු", "සීනි", "පැණි", "මත්පැන්", "බිත්තර", "තෙල්"],
    nature: ["හිරු", "සඳ", "තරු", "වළාකුළු", "සුළඟ", "වැසි", "කන්ද", "මුහුද", "වනාන්තරය", "හිම", "ගල්", "අහස"],
    colors: ["රතු", "නිල්", "සුදු", "කළු", "කහ", "කොළ", "රන්", "රිදී", "අළු"],
    house: ["දොර", "ජනේලය", "ඇඳ", "මේසය", "පුටුව", "පහන", "කාමරය", "බිත්තිය", "වත්ත", "වහලය"],
  },
  ne: {
    animals: ["सिंह", "बाघ", "घोडा", "मृग", "चरा", "माछा", "भालु", "गाई", "भेडा", "हात्ती", "बाँदर", "कुकुर", "बिरालो"],
    food: ["चिया", "चामल", "रोटी", "सूप", "मासु", "नुन", "चिनी", "मह", "रक्सी", "अण्डा", "तेल"],
    nature: ["सूर्य", "चन्द्र", "तारा", "बादल", "हावा", "वर्षा", "पहाड", "समुद्र", "जंगल", "हिउँ", "ढुङ्गा", "आकाश"],
    colors: ["रातो", "नीलो", "सेतो", "कालो", "पहेंलो", "हरियो", "सुनौलो", "चाँदी", "खैरो"],
    house: ["ढोका", "झ्याल", "ओछ्यान", "टेबुल", "कुर्सी", "बत्ती", "कोठा", "भित्ता", "बगैंचा", "छत"],
  },
  mr: {
    animals: ["सिंह", "वाघ", "घोडा", "हरिण", "पक्षी", "मासा", "अस्वल", "गाय", "मेंढी", "हत्ती", "माकड", "कुत्रा", "मांजर"],
    food: ["चहा", "तांदूळ", "भाकरी", "सूप", "मांस", "मीठ", "साखर", "मध", "मद्य", "अंडे", "तेल"],
    nature: ["सूर्य", "चंद्र", "तारा", "ढग", "वारा", "पाऊस", "डोंगर", "समुद्र", "जंगल", "बर्फ", "दगड", "आकाश"],
    colors: ["लाल", "निळा", "पांढरा", "काळा", "पिवळा", "हिरवा", "सुनेरी", "चांदी", "राखाडी"],
    house: ["दार", "खिडकी", "बेड", "मेज", "खुर्ची", "दिवा", "खोली", "भिंत", "बाग", "छत"],
  },
  gu: {
    animals: ["સિંહ", "વાઘ", "ઘોડો", "હરણ", "પક્ષી", "માછલી", "રીંછ", "ગાય", "ઘેટું", "હાથી", "વાંદરો", "કૂતરો", "બિલાડી"],
    food: ["ચા", "ચોખા", "રોટલી", "સૂપ", "માંસ", "મીઠું", "ખાંડ", "મધ", "દારૂ", "ઈંડું", "તેલ"],
    nature: ["સૂર્ય", "ચંદ્ર", "તારો", "વાદળ", "પવન", "વરસાદ", "પર્વત", "દરિયો", "જંગલ", "બરફ", "પથ્થર", "આકાશ"],
    colors: ["લાલ", "વાદળી", "સફેદ", "કાળો", "પીળો", "લીલો", "સોનેરી", "ચાંદી", "રાખોડી"],
    house: ["દરવાજો", "બારી", "પલંગ", "ટેબલ", "ખુરશી", "દીવો", "રૂમ", "દીવાલ", "બગીચો", "છત"],
  },
  pa: {
    animals: ["ਸ਼ੇਰ", "ਬਾਘ", "ਘੋੜਾ", "ਹਿਰਨ", "ਪੰਛੀ", "ਮੱਛੀ", "ਰਿੱਛ", "ਗਾਂ", "ਭੇਡ", "ਹਾਥੀ", "ਬਾਂਦਰ", "ਕੁੱਤਾ", "ਬਿੱਲੀ"],
    food: ["ਚਾਹ", "ਚੌਲ", "ਰੋਟੀ", "ਸੂਪ", "ਮੀਟ", "ਲੂਣ", "ਖੰਡ", "ਸ਼ਹਿਦ", "ਸ਼ਰਾਬ", "ਆਂਡਾ", "ਤੇਲ"],
    nature: ["ਸੂਰਜ", "ਚੰਦਰਮਾ", "ਤਾਰਾ", "ਬੱਦਲ", "ਹਵਾ", "ਮੀਂਹ", "ਪਹਾੜ", "ਸਮੁੰਦਰ", "ਜੰਗਲ", "ਬਰਫ਼", "ਪੱਥਰ", "ਅਸਮਾਨ"],
    colors: ["ਲਾਲ", "ਨੀਲਾ", "ਚਿੱਟਾ", "ਕਾਲਾ", "ਪੀਲਾ", "ਹਰਾ", "ਸੁਨਹਿਰੀ", "ਚਾਂਦੀ", "ਸਲੇਟੀ"],
    house: ["ਦਰਵਾਜ਼ਾ", "ਖਿੜਕੀ", "ਬਿਸਤਰਾ", "ਮੇਜ਼", "ਕੁਰਸੀ", "ਦੀਵਾ", "ਕਮਰਾ", "ਕੰਧ", "ਬਗੀਚਾ", "ਛੱਤ"],
  },
  kn: {
    animals: ["ಸಿಂಹ", "ಹುಲಿ", "ಕುದುರೆ", "ಜಿಂಕೆ", "ಹಕ್ಕಿ", "ಮೀನು", "ಕರಡಿ", "ಹಸು", "ಕುರಿ", "ಆನೆ", "ಕೋತಿ", "ನಾಯಿ", "ಬೆಕ್ಕು"],
    food: ["ಚಹಾ", "ಅಕ್ಕಿ", "ರೊಟ್ಟಿ", "ಸೂಪ್", "ಮಾಂಸ", "ಉಪ್ಪು", "ಸಕ್ಕರೆ", "ಜೇನುತುಪ್ಪ", "ಮದ್ಯ", "ಮೊಟ್ಟೆ", "ಎಣ್ಣೆ"],
    nature: ["ಸೂರ್ಯ", "ಚಂದ್ರ", "ನಕ್ಷತ್ರ", "ಮೋಡ", "ಗಾಳಿ", "ಮಳೆ", "ಬೆಟ್ಟ", "ಸಮುದ್ರ", "ಕಾಡು", "ಹಿಮ", "ಕಲ್ಲು", "ಆಕಾಶ"],
    colors: ["ಕೆಂಪು", "ನೀಲಿ", "ಬಿಳಿ", "ಕಪ್ಪು", "ಹಳದಿ", "ಹಸಿರು", "ಚಿನ್ನ", "ಬೆಳ್ಳಿ", "ಬೂದು"],
    house: ["ಬಾಗಿಲು", "ಕಿಟಕಿ", "ಹಾಸಿಗೆ", "ಮೇಜು", "ಕುರ್ಚಿ", "ದೀಪ", "ಕೋಣೆ", "ಗೋಡೆ", "ತೋಟ", "ಛಾವಣಿ"],
  },
  ml: {
    animals: ["സിംഹം", "കടുവ", "കുതിര", "മാൻ", "പക്ഷി", "മീൻ", "കരടി", "പശു", "ആട്", "ആന", "കുരങ്ങ്", "പട്ടി", "പൂച്ച"],
    food: ["ചായ", "അരി", "റൊട്ടി", "സൂപ്പ്", "ഇറച്ചി", "ഉപ്പ്", "പഞ്ചസാര", "തേൻ", "മദ്യം", "മുട്ട", "എണ്ണ"],
    nature: ["സൂര്യൻ", "ചന്ദ്രൻ", "നക്ഷത്രം", "മേഘം", "കാറ്റ്", "മഴ", "മല", "കടൽ", "കാട്", "മഞ്ഞ്", "കല്ല്", "ആകാശം"],
    colors: ["ചുവപ്പ്", "നീല", "വെള്ള", "കറുപ്പ്", "മഞ്ഞ", "പച്ച", "സ്വർണ്ണം", "വെള്ളി", "ചാരനിറം"],
    house: ["വാതിൽ", "ജനൽ", "കിടക്ക", "മേശ", "കസേര", "വിളക്ക്", "മുറി", "ഭിത്തി", "തോട്ടം", "മേൽക്കൂര"],
  },
  sw: {
    animals: ["SIMBA", "TUI", "FARASI", "PAALA", "NDEGE", "SAMAKI", "DUBA", "NGOMBE", "KONDOO", "TEMBO", "NYANI", "MBWA", "PAKA"],
    food: ["CHAI", "MCHELE", "MKATE", "SUPU", "NYAMA", "CHUMVI", "SUKARI", "ASALI", "MVINYO", "YAI", "MAFUTA"],
    nature: ["JUA", "MWEZI", "NYOTA", "WAVU", "UPEPO", "MVUA", "MLIMA", "BAHARI", "MSITU", "BARAFU", "MAWE", "ANGA"],
    colors: ["NYEKUNDU", "BULUU", "NYEUPE", "NYEUSI", "MANJANO", "KIJANI", "DHAHABU", "FEDHA", "KIKIJIVU"],
    house: ["MLANGO", "DIRISHA", "KITANDA", "MEZA", "KITI", "TAA", "CHUMBA", "UKUTA", "BUSTANI", "PAA"],
  },
  he: {
    animals: ["אריה", "נמר", "סוס", "צבי", "ציפור", "דג", "דוב", "פרה", "כבשה", "פיל", "קוף", "כלב", "חתול"],
    food: ["תה", "אורז", "לחם", "מרק", "בשר", "מלח", "סוכר", "דבש", "יין", "ביצה", "שמן"],
    nature: ["שמש", "ירח", "כוכב", "ענן", "רוח", "גשם", "הר", "ים", "יער", "שלג", "אבן", "שמיים"],
    colors: ["אדום", "כחול", "לבן", "שחור", "צהוב", "ירוק", "זהב", "כסף", "אפור"],
    house: ["דלת", "חלון", "מיטה", "שולחן", "כיסא", "מנורה", "חדר", "קיר", "גינה", "גג"],
  },
  fa: {
    animals: ["شیر", "ببر", "اسب", "آهو", "پرنده", "ماهی", "خرس", "گاو", "گوسفند", "فیل", "میمون", "سگ", "گربه"],
    food: ["چای", "برنج", "نان", "سوپ", "گوشت", "نمک", "شکر", "عسل", "شراب", "تخم مرغ", "روغن"],
    nature: ["خورشید", "ماه", "ستاره", "ابر", "باد", "باران", "کوه", "دریا", "جنگل", "برف", "سنگ", "آسمان"],
    colors: ["قرمز", "آبی", "سفید", "سیاه", "زرد", "سبز", "طلایی", "نقره ای", "خاکستری"],
    house: ["در", "پنجره", "تخت", "میز", "صندلی", "چراغ", "اتاق", "دیوار", "باغ", "سقف"],
  },
  am: {
    animals: ["አንበሳ", "ነብር", "ፈረስ", "አጋዘን", "ወፍ", "ዓሣ", "ድብ", "ላም", "በግ", "ዝሆን", "ዝንጀሮ", "ውሻ", "ድመት"],
    food: ["ሻይ", "ሩዝ", "ዳቦ", "ሾርባ", "ሥጋ", "ጨው", "ስኳር", "ማር", "ወይን", "እንቁላል", "ዘይት"],
    nature: ["ፀሐይ", "ጨረቃ", "ኮከብ", "ደመና", "ንፋስ", "ዝናብ", "ተራራ", "ባሕር", "ደን", "በረዶ", "ድንጋይ", "ሰማይ"],
    colors: ["ቀይ", "ሰማያዊ", "ነጭ", "ጥቁር", "ቢጫ", "አረንጓዴ", "ወርቅ", "ብር", "ግራጫ"],
    house: ["በር", "መስኮት", "አልጋ", "ጠረጴዛ", "ወንበር", "መብራት", "ክፍል", "ግድግዳ", "አትክልት", "ጣሪያ"],
  },
  ha: {
    animals: ["ZAKI", "DAMISA", "DOKI", "BAREWA", "TSUNTSU", "KIFI", "BEER", "SA", "TUMAKI", "GIWA", "BIRI", "KARE", "KURA"],
    food: ["SHAYI", "SHINKAFA", "BUREDIP", "MIYA", "NAMA", "GISHIRI", "SUKARI", "ZUMA", "GIYA", "KWAN", "MAI"],
    nature: ["RANA", "WATA", "TAURARO", "GIZAGIZAI", "ISKA", "RUWA", "DUTSE", "TEKU", "DAJI", "KANKARA", "DUWUTSU", "SAMA"],
    colors: ["JA", "SHUDI", "FARI", "BAKI", "RAWAYA", "KORE", "ZINARI", "AZURFA", "TOKA"],
    house: ["KOFA", "TAGA", "GADO", "TEBUR", "KUJERA", "FITILA", "DAKI", "BANGO", "LUMBU", "JINFI"],
  },
  yo: {
    animals: ["KINIUN", "EKUN", "ESIN", "EGBIN", "EYE", "EJA", "BEER", "MALU", "AGUNTAN", "ERIN", "OBO", "AJA", "OLOGBO"],
    food: ["TI", "IRESI", "BUREDIP", "OBE", "ERAN", "IYO", "SUGA", "OYIN", "OTI", "EYIN", "EPO"],
    nature: ["ORUN", "OSUPA", "IRAWO", "IKUKU", "AFEFE", "OJO", "OKE", "OKUN", "IGBO", "YINNYIN", "OKUTA", "ORUN AFAR"],
    colors: ["PUPA", "BULUU", "FUNFUN", "DUDU", "IYEFA", "AWO EWE", "WURA", "FADAKA", "EERU"],
    house: ["ILEKUN", "FERESE", "IBUSUN", "TEBUR", "AGA", "ATUPA", "IYARA", "OGIRI", "OGBA", "ORULE"],
  },
  zu: {
    animals: ["IBHUBESI", "INGWE", "IHASHI", "INYATHI", "INYONI", "INHLANZI", "IBHERE", "INKOMO", "IMVU", "INDLOVU", "INCAWANE", "INJA", "IKATI"],
    food: ["ITIYE", "ILAYISI", "ISINKWA", "ISOBHO", "INYAMA", "USAWOTI", "USHUKELA", "UJU", "IWAYINI", "IQANDA", "AMAFUTA"],
    nature: ["ILANGA", "INYAZI", "INKANYEZI", "IFU", "UMOYA", "IMVULA", "INTABA", "ULWANDLE", "IHLATHI", "IQHWA", "ITSHE", "ISIBHAKABHAKA"],
    colors: ["BOMVU", "LILISA", "MHLOPHE", "MNYAMA", "PHUZI", "LULA", "GOLIDE", "SILIVA", "MPUNGA"],
    house: ["ISIVALO", "IFESITELA", "UMBHEDE", "ITAULA", "ISIHLALO", "ISIBANI", "IKAMELO", "UDONGA", "INGGADI", "UPHAHLA"],
  },
  af: {
    animals: ["LEEU", "TIER", "PERD", "HERT", "VOEL", "VIS", "BEER", "KOEI", "SKAAP", "OLIFANT", "AAP", "HOND", "KAT"],
    food: ["TEE", "RYS", "BROOD", "SOP", "VLEIS", "SOUT", "SUIKER", "HEUNING", "WYN", "EIER", "OLIE"],
    nature: ["SON", "MAAN", "STER", "WOLK", "WIND", "REËN", "BERG", "SEE", "BOS", "SNEEU", "KLIP", "LUG"],
    colors: ["ROOI", "BLOU", "WIT", "SWART", "GEEL", "GROEN", "GOUD", "SILWER", "GYS"],
    house: ["DEUR", "VENSTER", "BED", "TAFEL", "STOEL", "LAMP", "KAMER", "MUUR", "TUIN", "DAK"],
  },
};

// Validate and clean each language bank
const CLEANED_BANKS = {};
const DICTIONARY_ALL = {};

for (const langCode in RAW_BANKS) {
  CLEANED_BANKS[langCode] = {};
  const allLangWords = new Set();
  const rawLang = RAW_BANKS[langCode];

  for (const category of ["animals", "food", "nature", "colors", "house"]) {
    const rawList = rawLang[category] || [];
    const validWords = [];
    for (const w of rawList) {
      const trimmed = w.trim();
      if (checkUniqueChars(trimmed) && trimmed.length >= 2) {
        validWords.push(trimmed);
        allLangWords.add(trimmed);
      }
    }
    // ensure at least 8 words per category
    if (validWords.length < 8) {
      console.warn(`Lang ${langCode} cat ${category} only has ${validWords.length} unique words.`);
    }
    CLEANED_BANKS[langCode][category] = validWords;
  }
  DICTIONARY_ALL[langCode] = Array.from(allLangWords);
}

console.log("Validation complete. Language count:", Object.keys(CLEANED_BANKS).length);

// Write src/data/dictionary.js
const dictOutPath = path.join(__dirname, "..", "src", "data", "dictionary.js");
const dictFileContent = `// Comprehensive Dictionary & Bonus Words for all 56 languages
// Generated automatically for Word Connect

export const DICTIONARY_WORDS = ${JSON.stringify(DICTIONARY_ALL, null, 2)};

export function isValidDictionaryWord(word, langCode) {
  if (!word || !langCode) return false;
  const upper = word.toUpperCase().trim();
  const bank = DICTIONARY_WORDS[langCode] || DICTIONARY_WORDS.en || [];
  return bank.some((w) => w.toUpperCase().trim() === upper);
}
`;
fs.writeFileSync(dictOutPath, dictFileContent, "utf8");
console.log("Wrote", dictOutPath);

// Write src/data/banks.js
const banksOutPath = path.join(__dirname, "..", "src", "data", "banks.js");
const banksFileContent = `// Curated Unique-Character Vocabulary Banks for all 56 languages
// Used for deterministic level generation across 12 Worlds and 600 Levels

export const BANKS = ${JSON.stringify(CLEANED_BANKS, null, 2)};
`;
fs.writeFileSync(banksOutPath, banksFileContent, "utf8");
console.log("Wrote", banksOutPath);
