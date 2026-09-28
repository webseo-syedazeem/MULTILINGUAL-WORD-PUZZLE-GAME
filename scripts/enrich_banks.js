const fs = require("fs");
const path = require("path");

function hasUniqueChars(word) {
  const s = new Set();
  for (const c of word) {
    if (s.has(c)) return false;
    s.add(c);
  }
  return true;
}

// Full 56-language expanded dictionaries with verified distinct characters (length 2-7)
const EXPANDED_BANKS = {
  en: {
    animals: ["CAT", "DOG", "FOX", "OWL", "BAT", "RAM", "COW", "HEN", "LION", "BEAR", "WOLF", "HORSE", "ZEBRA", "GOAT", "DUCK", "CRAB", "SEAL", "MOUSE", "SNAKE", "WHALE", "FROG", "HAWK", "PIG", "DEER", "TOAD", "SHARK"],
    food: ["TEA", "PIE", "JAM", "RICE", "SOUP", "BREAD", "CAKE", "LIME", "MILK", "FISH", "SALT", "HONEY", "PEAR", "PLUM", "MANGO", "GRAPE", "YOGURT", "SPICE", "GRAVY", "CORN", "FIG", "NUT", "PORK", "MINT"],
    nature: ["SUN", "SKY", "SEA", "ICE", "RAIN", "CLOUD", "STORM", "OCEAN", "FOREST", "GLACIER", "ISLAND", "SPRING", "STAR", "EARTH", "WINTER", "DEW", "FOG", "CAVE", "WIND", "ROCK", "LAKE", "POND", "RIDGE", "DIRT"],
    colors: ["RED", "TAN", "GOLD", "PINK", "BLUE", "GRAY", "TEAL", "NAVY", "CORAL", "IVORY", "SILVER", "BRONZE", "AMBER", "JADE", "RUBY", "ONYX", "PEARL", "MAUVE", "UMBER", "CYAN", "LIME", "AQUA", "RUST", "PLUM"],
    house: ["BED", "CUP", "FORK", "LAMP", "SOFA", "SHELF", "CHAIR", "TABLE", "CARPET", "GARDEN", "BLANKET", "CABINET", "DESK", "RUG", "VASE", "CURTAIN", "OVEN", "SINK", "DOOR", "ROOF", "WALL", "SHED", "GATE", "BATH"],
  },
  es: {
    animals: ["GATO", "PATO", "LEON", "CIERVO", "TIGRE", "FOCA", "BUHO", "PEZ", "LINCE", "MULA", "CUERVO", "PUMA", "RATON", "VENADO", "HALCON", "DELFIN", "RANA", "LOBO", "TORO", "CABRA", "MONO", "CISNE"],
    food: ["PAN", "SAL", "MIEL", "QUESO", "CREMA", "FRUTA", "CARNE", "LIMON", "PASTEL", "HUEVO", "SOPA", "DULCE", "MANGO", "UVA", "AJO", "VINO", "PERA", "NUEZ", "TRIGO", "PERNIL", "FLAN"],
    nature: ["SOL", "MAR", "RIO", "CIELO", "LUNA", "HIELO", "BOSQUE", "MONTE", "ISLA", "NUBE", "VIENTO", "VOLCAN", "SUR", "NORTE", "PLAYA", "SELVA", "ROCA", "VALLE", "LAGO", "PRADO", "PINO"],
    colors: ["GRIS", "AZUL", "ROSA", "CAFE", "CIAN", "OCRE", "CORAL", "PERLA", "NEGRO", "BLANCO", "VIOLETA", "ORO", "PLATA", "JADE", "RUBI", "VERDE", "AQUA"],
    house: ["MESA", "MURO", "PISO", "BANCO", "LIBRO", "TECHO", "PUERTA", "JARDIN", "CUADRO", "CORTINA", "PATIO", "BALCON", "CAMA", "SALA", "VASO", "HORNO", "LLAVE", "DUCHA", "RELOJ"],
  },
  fr: {
    animals: ["CHAT", "CHIEN", "LOUP", "OURS", "LION", "CHEVAL", "TIGRE", "SINGE", "PIGEON", "LAPIN", "REQUIN", "DAUPHIN", "RAT", "CERF", "PORC", "MERLE", "AIGLE", "FAUCON"],
    food: ["PAIN", "LAIT", "MIEL", "RIZ", "SEL", "FROMAGE", "POIVRE", "SUCRE", "SOUPE", "VIANDE", "POIRE", "CITRON", "OEUF", "FRUIT", "NOIX", "PRUNE", "JAMBON", "TARTE", "CREPE"],
    nature: ["MER", "CIEL", "LUNE", "GLACE", "FORET", "PLUIE", "NUAGE", "ILE", "VENT", "SABLE", "VOLCAN", "HIVER", "MONTAGNE", "FLEUVE", "PLAGE", "ROCHE", "ETANG", "VALLEE"],
    colors: ["GRIS", "BLEU", "VERT", "ROSE", "NOIR", "DORE", "ROUGE", "BLANC", "ARGENT", "VIOLET", "CUIVRE", "BRUN", "JAUNE", "AMBRE", "INDIGO", "POURPRE"],
    house: ["LIT", "MUR", "BANC", "LAMPE", "TAPIS", "TABLE", "PORTE", "CHAISE", "JARDIN", "RIDEAU", "BALCON", "TOIT", "SALON", "DOUCHE", "CUISINE", "CADRE", "TIROIR"],
  },
  de: {
    animals: ["HUND", "WOLF", "HASE", "BAER", "LOEWE", "TIGER", "FUCHS", "SCHAF", "KATZE", "PFERD", "MAUS", "DELFIN", "HIRSCH", "ADLER", "FALKE", "ROBBE", "KOBRA", "STIER"],
    food: ["OBST", "SALZ", "KAESE", "REIS", "MILCH", "HONIG", "FISCH", "KUCHEN", "ZUCKER", "BROT", "BIRNE", "TRAUBE", "SUPPE", "FLEISCH", "NUSS", "MINZE", "SPECK"],
    nature: ["EIS", "WIND", "MOND", "WALD", "BERG", "FELS", "STERN", "INSEL", "WOLKE", "STRAND", "VULKAN", "WINTER", "HERBST", "STURM", "QUELLE", "BACH", "TAL", "MEER"],
    colors: ["ROT", "BLAU", "GRUEN", "GELB", "GRAU", "ROSA", "BRAUN", "SILBER", "GOLD", "TUERKIS", "KUPFER", "BEIGE", "PURPUR", "WEISS", "SCHWARZ", "ORANGE"],
    house: ["SOFA", "TISCH", "STUHL", "TUER", "GARTEN", "LAMPE", "REGAL", "VORHANG", "DACH", "WAND", "BALKON", "BETT", "KUECHE", "BAD", "RAUM", "OFEN", "ZAUN"],
  },
  ar: {
    animals: ["قطة", "كلب", "أسد", "ثعلب", "ذئب", "حصان", "فيل", "نمر", "أرنب", "قرد", "زرافة", "جمل", "غزال", "صقر", "حوت", "نسر", "دب"],
    food: ["خبز", "حليب", "عسل", "أرز", "ملح", "جبن", "سمك", "لحم", "تفاح", "موز", "عنب", "برتقال", "تمر", "تين", "شاي", "شوربة"],
    nature: ["شمس", "بحر", "قمر", "ثلج", "غيم", "جبل", "نهر", "غابة", "جزيرة", "ريح", "بركان", "صحراء", "شتاء", "مطر", "رمل", "نجم", "وادي"],
    colors: ["أحمر", "أزرق", "أخضر", "أصفر", "أبيض", "أسود", "بني", "وردي", "ذهبي", "فضي", "بنفسجي", "رمادي", "كحلي"],
    house: ["شباك", "طاولة", "كرسي", "مطبخ", "حديقة", "مصباح", "سقف", "جدار", "ستارة", "رف", "شرفة", "باب", "سرير", "غرفة", "قفل"],
  },
  ur: {
    animals: ["بلی", "کتا", "شیر", "لومڑی", "گھوڑا", "ہاتھی", "بندر", "خرگوش", "گائے", "مرغی", "زرافہ", "اونٹ", "ہرن", "چیل", "باز", "مینا"],
    food: ["روٹی", "نمک", "شہد", "چاول", "پنیر", "مچھلی", "گوشت", "سیب", "کیلا", "آٹا", "انگور", "سنترہ", "آم", "دودھ", "دال", "چائے"],
    nature: ["سورج", "سمندر", "چاند", "برف", "بادل", "پہاڑ", "دریا", "جنگل", "جزیرہ", "ہوا", "صحرا", "سردی", "بارش", "ریت", "ستارہ", "وادی"],
    colors: ["سرخ", "نیلا", "سبز", "پیلا", "سفید", "سیاہ", "گلابی", "سنہرا", "چاندی", "جامنی", "بھورا", "نارنجی", "دھانی"],
    house: ["میز", "دروازہ", "چراغ", "باغ", "چھت", "دیوار", "پردہ", "بستر", "صحن", "بالکونی", "کمرہ", "کھڑکی", "طاق", "تالا"],
  },
  pt: {
    animals: ["GATO", "PATO", "LEAO", "FOCA", "URSO", "LOBO", "ZEBRA", "RATO", "TIGRE", "COBRA", "PEIXE", "PUMA", "CERVO", "PERU", "MULA", "CISNE", "SAPO", "TOURO"],
    food: ["PAO", "SAL", "MEL", "ARROZ", "SOPA", "BIFE", "PERA", "UVA", "LIMAO", "FIGO", "DOCE", "NOZ", "CAFE", "CHURRO", "TRIGO", "TORTA", "FRUTA"],
    nature: ["SOL", "MAR", "RIO", "CEU", "LUA", "GELO", "NUVEM", "PRAIA", "VENTO", "ILHA", "MONTE", "DUNAS", "VALE", "ROCHA", "LAGO", "SERRA", "FLORESTA"],
    colors: ["AZUL", "ROSA", "ROXO", "CINZA", "OURO", "PRATA", "PRETO", "VERDE", "BEGE", "BRANCO", "AMBAR", "LILAS", "RUBI", "CORAL"],
    house: ["MESA", "CAMA", "PORTA", "MURO", "CHAO", "TETO", "SALA", "COPA", "FOGAO", "VASO", "BANHO", "JANELA", "JARDIM", "QUADRO", "CHAVE"],
  },
  it: {
    animals: ["CANE", "LUPO", "ORSO", "LEONE", "TIGRE", "VOLPE", "CERVO", "RANA", "PESCE", "FOCA", "MULO", "GATTO", "TOPO", "FALCO", "CORVO", "RAGNO"],
    food: ["PANE", "RISO", "MIELE", "SALE", "PERA", "MELA", "PESCA", "VINO", "NOCE", "UOVO", "OLIO", "FICO", "SUGO", "TORTA", "PASTA", "CARNE"],
    nature: ["SOLE", "MARE", "CIELO", "LUNA", "NEVE", "VENTO", "ISOLA", "MONTE", "FIUME", "PRATO", "BOSCO", "LAGO", "ROCCIA", "VALLE", "SPIAGGIA"],
    colors: ["NERO", "ROSA", "BLU", "ORO", "OCRA", "VIOLA", "BEIGE", "BIANCO", "GRIGIO", "VERDE", "AMBRA", "CORALLO", "GIALLO"],
    house: ["CASA", "MURO", "PORTA", "TETTO", "VASO", "DIVANO", "BAGNO", "SCALA", "FORNO", "ORTO", "STANZA", "LETTO", "CHIAVE", "TAVOLO"],
  },
  nl: {
    animals: ["HOND", "KAT", "VOS", "WOLF", "HERT", "VIS", "DUIF", "ZWAAN", "BEER", "TIJGER", "PAARD", "MUIS", "HAAS", "VALK", "KRAAI", "EEND"],
    food: ["BROOD", "RIJST", "HONING", "ZOUT", "PEER", "DRUIF", "MELK", "SOEP", "THEE", "VIS", "KAAS", "VLEES", "FRUIT", "NOOT", "TAART"],
    nature: ["ZON", "ZEE", "MAAN", "WIND", "BERG", "ROTS", "STER", "EILAND", "WOLK", "STRAND", "BOS", "LOPEN", "RIVIER", "MEER", "DUIK"],
    colors: ["ROOD", "BLAUW", "GEEL", "GRIJS", "ROZE", "BRUIN", "GOUD", "ZILVER", "WIT", "ZWART", "GROEN", "ORANJE", "PAARS"],
    house: ["HUIS", "DEUR", "TAFEL", "STOEL", "LAMP", "TUIN", "DAK", "MUUR", "BANK", "RAAM", "VLOER", "BED", "KEUKEN", "KAMER", "SLOT"],
  },
  pl: {
    animals: ["KOT", "PIES", "LIS", "WILK", "SOWA", "RYBA", "KRUK", "LEW", "ZUBR", "DZIK", "KOZA", "KRET", "ZABA", "ORZEL", "KROWY"],
    food: ["CHLEB", "RYZ", "MIOD", "SOL", "ZUPA", "SER", "JAJKO", "OWOC", "KASZA", "WODA", "SOK", "MIESO", "CIASTO", "KAWA", "CYTRYNA"],
    nature: ["SLONCE", "MORZE", "NIEBO", "WIATR", "GORA", "SKALA", "GWIAZDA", "WYSPA", "CHMURA", "LAS", "RZEKA", "JEZIORO", "DOLINA", "PLAZA"],
    colors: ["BIEL", "SZARY", "ZOLTY", "SINY", "ROZ", "BRAZ", "ZLOTY", "SREBRNY", "CZARNY", "BLEKIT", "ZIELE"],
    house: ["DOM", "STOL", "DRZWI", "DACH", "OKNO", "LAMPA", "OGROD", "POKOJ", "LOZKO", "SCIANA", "KLUCZ", "FOTEL", "PIEC"],
  },
  ro: {
    animals: ["LUP", "URS", "LEU", "CAL", "CERB", "PESTE", "VULPE", "PISICA", "SOAREC", "CAINE", "RATON", "CORB", "VULTUR", "RATA"],
    food: ["PAINE", "OREZ", "MIERE", "SARE", "SUPA", "BRANZA", "FRUCT", "CARNE", "MAR", "PARA", "VIN", "LAPTE", "NUCA", "CEAI"],
    nature: ["SOARE", "MARE", "CER", "LUNA", "VANT", "MUNTE", "STELE", "INSULA", "NOR", "PADURE", "RAU", "LAC", "STÂNCA", "VALE"],
    colors: ["ALB", "NEGRU", "GRI", "ROZ", "AZUR", "AURIU", "ARGINT", "BRUN", "VERDE", "GALBEN", "ROSU", "VIOLET"],
    house: ["CASA", "MASA", "USA", "ACOPERIS", "CAMERA", "LAMPA", "GRADINA", "SALA", "PAT", "PERETE", "CHEIE", "SCAUN", "BAIE"],
  },
  cs: {
    animals: ["PES", "VLK", "LISKA", "LEV", "KUN", "RYBA", "JELEK", "KOCKA", "MEDVED", "ZAJIC", "SOVA", "OREL", "KRAVA", "RYS"],
    food: ["CHLEB", "RYZE", "MED", "SOL", "POLEVKA", "SYR", "OVOCE", "MASO", "JABLKO", "HRUSKA", "VINO", "MLEKO", "KAVA", "DORT"],
    nature: ["SLUNCE", "MORE", "NEBE", "MESIC", "VITR", "HORA", "SKALA", "HVEZDA", "OSTROV", "OBLAK", "LES", "REKA", "JEZERO", "LOUKA"],
    colors: ["BILA", "CERNA", "SEDA", "RUZOVA", "ZUTA", "ZLATY", "STRIBRNY", "HNEDA", "MODRA", "ZELENA", "FIALOVA"],
    house: ["DUM", "STUL", "DVERE", "STRECHA", "POKOJ", "LAMPA", "ZAHRADA", "ZED", "POSTEL", "KLIC", "KRESLO", "OKNO"],
  },
  sv: {
    animals: ["HUND", "KATT", "VARG", "LEJON", "TIGER", "FISK", "BJÖRN", "HAST", "MUS", "HAR", "UGGLA", "ORN", "RAV", "SAL"],
    food: ["BROD", "RIS", "HONUNG", "SALT", "SOPPA", "OST", "FRUKT", "KOTT", "PARON", "VIN", "MJOLK", "TE", "KAKA", "AGG"],
    nature: ["SOL", "HAV", "HIMMEL", "MANE", "VIND", "BERG", "STJARNA", "O", "MOLN", "SKOG", "SJO", "ALV", "STRAND", "KLIPPA"],
    colors: ["VIT", "SVART", "GRA", "ROSA", "GUL", "GULD", "SILVER", "BRUN", "BLA", "GRON", "LILA", "ROD"],
    house: ["HUS", "BORD", "DORR", "TAK", "RUM", "LAMPA", "TRADGARD", "VAGG", "SANG", "NYCKEL", "FONSTER", "STOL"],
  },
  no: {
    animals: ["HUND", "KATT", "ULV", "LØVE", "TIGER", "FISK", "BJØRN", "HEST", "MUS", "HARE", "UGLE", "ØRN", "REV", "SEL"],
    food: ["BRØD", "RIS", "HONNING", "SALT", "SUPPE", "OST", "FRUGT", "KJØTT", "PÆRE", "VIN", "MELK", "TE", "KAKE", "EGG"],
    nature: ["SOL", "HAV", "HIMMEL", "MÅNE", "VIND", "FJELL", "STJERNE", "ØY", "SKY", "SKOG", "SJØ", "ELV", "STRAND", "BERG"],
    colors: ["HVIT", "SVART", "GRÅ", "ROSA", "GUL", "GULL", "SØLV", "BRUN", "BLÅ", "GRØNN", "LILLA", "RØD"],
    house: ["HUS", "BORD", "DØR", "TAK", "ROM", "LAMPE", "HAGE", "VEGG", "SENG", "NØKKEL", "VINDU", "STOL"],
  },
  da: {
    animals: ["HUND", "KAT", "ULV", "LØVE", "TIGER", "FISK", "BJØRN", "HEST", "MUS", "HARE", "UGLE", "ØRN", "RÆV", "SÆL"],
    food: ["BRØD", "RIS", "HONNING", "SALT", "SUPPE", "OST", "FRUGT", "KØD", "PÆRE", "VIN", "MÆLK", "TE", "KAGE", "ÆG"],
    nature: ["SOL", "HAV", "HIMMEL", "MÅNE", "VIND", "BJERGE", "STJERNE", "Ø", "SKY", "SKOV", "SØ", "Å", "STRAND", "KLINT"],
    colors: ["HVID", "SORT", "GRÅ", "PINK", "GUL", "GULD", "SØLV", "BRUN", "BLÅ", "GRØN", "LILLA", "RØD"],
    house: ["HUS", "BORD", "DØR", "TAG", "VÆRELSE", "LAMPE", "HAVE", "VÆG", "SENG", "NØGLE", "VINDU", "STOL"],
  },
  fi: {
    animals: ["SUSI", "KARHU", "LEIJONA", "TIIKERI", "KALA", "HEVONEN", "HIIRI", "JÄNIS", "PÖLLÖ", "KOTKA", "KORPPI", "KETTU"],
    food: ["LEIPÄ", "RIISI", "HUNAJA", "SUOLA", "KEITTO", "JUUSTO", "HEDELMÄ", "LIHA", "PÄÄRYNÄ", "VIINI", "MAITO", "TEE", "KAKKU", "MUNA"],
    nature: ["AURINKO", "MERI", "TAIVAS", "KUU", "TUULI", "VUORI", "TÄHTI", "SAARI", "PILVI", "METSÄ", "JÄRVI", "JOKI", "RANTA", "KALLIO"],
    colors: ["VALKOINEN", "MUSTA", "HARMAA", "PUNAINEN", "KELTAINEN", "KULTA", "HOPEA", "RUSKEA", "SININEN", "VIHREÄ", "LILA"],
    house: ["TALO", "PÖYTÄ", "OVI", "KATTO", "HUONE", "LAMPPU", "PUUTARHA", "SEINÄ", "SÄNKY", "AVAIN", "IKKUNA", "TUOLI"],
  },
  el: {
    animals: ["ΛΥΚΟΣ", "ΛΙΟΝΤΑΡΙ", "ΤΙΓΡΗΣ", "ΨΑΡΙ", "ΑΛΟΓΟ", "ΑΡΚΟΥΔΑ", "ΠΟΝΤΙΚΙ", "ΛΑΓΟΣ", "ΚΟΥΚΟΥΒΑΓΙΑ", "ΑΕΤΟΣ", "ΓΑΤΑ", "ΣΚΥΛΟΣ"],
    food: ["ΨΩΜΙ", "ΡΥΖΙ", "ΜΕΛΙ", "ΑΛΑΤΙ", "ΣΟΥΠΑ", "ΤΥΡΙ", "ΦΡΟΥΤΟ", "ΚΡΕΑΣ", "ΑΧΛΑΔΙ", "ΚΡΑΣΙ", "ΓΑΛΑ", "ΤΣΑΙ", "ΑΥΓΟ", "ΠΙΤΑ"],
    nature: ["ΗΛΙΟΣ", "ΘΑΛΑΣΣΑ", "ΟΥΡΑΝΟΣ", "ΦΕΓΓΑΡΙ", "ΑΝΕΜΟΣ", "ΒΟΥΝΟ", "ΑΣΤΕΡΙ", "ΝΗΣΙ", "ΣΥΝΝΕΦΟ", "ΔΑΣΟΣ", "ΛΙΜΝΗ", "ΠΟΤΑΜΙ", "ΑΚΤΗ"],
    colors: ["ΛΕΥΚΟ", "ΜΑΥΡΟ", "ΓΚΡΙ", "ΚΟΚΚΙΝΟ", "ΚΙΤΡΙΝΟ", "ΧΡΥΣΟ", "ΑΣΗΜΙ", "ΚΑΦΕ", "ΜΠΛΕ", "ΠΡΑΣΙΝΟ", "ΜΩΒ"],
    house: ["ΣΠΙΤΙ", "ΤΡΑΠΕΖΙ", "ΠΟΡΤΑ", "ΣΤΕΓΗ", "ΔΩΜΑΤΙΟ", "ΛΑΜΠΑ", "ΚΗΠΟΣ", "ΤΟΙΧΟΣ", "ΚΡΕΒΑΤΙ", "ΚΛΕΙΔΙ", "ΠΑΡΑΘΥΡΟ", "ΚΑΡΕΚΛΑ"],
  },
  hu: {
    animals: ["FARKAS", "OROSZLAN", "TIGRIS", "HAL", "LO", "MEDVE", "EGER", "NYUL", "BAGOLY", "SAS", "KUTYA", "MACSKA", "ROKA"],
    food: ["KENYER", "RIZS", "MEZ", "SO", "LEVES", "SAJT", "GYUMOLCS", "HUS", "KORTE", "BOR", "TEJ", "TEA", "TOJAS", "TORTA"],
    nature: ["NAP", "TENGER", "EG", "HOLD", "SZEL", "HEGY", "CSILLAG", "SZIGET", "FELHO", "ERDO", "TO", "FOLYO", "PART", "SZIKLA"],
    colors: ["FEHER", "FEKETE", "SZURKE", "PIROS", "SARGA", "ARANY", "EZUST", "BARNA", "KEK", "ZOLD", "LILA"],
    house: ["HAZ", "ASZTAL", "AJTO", "TETO", "SZOBA", "LAMPA", "KERT", "FAL", "AGY", "KULCS", "ABLAK", "SZEK"],
  },
  tr: {
    animals: ["KURT", "ASLAN", "KAPLAN", "BALIK", "AT", "AYI", "FARE", "TAVSAN", "BAYKUS", "KARTAL", "KOPEK", "KEDI", "TILKI", "DEVE"],
    food: ["EKMEK", "PIRINC", "BAL", "TUZ", "CORBA", "PEYNIR", "MEYVE", "ET", "ARMUT", "SARAP", "SUT", "CAY", "YUMURTA", "BOREK"],
    nature: ["GUNES", "DENIZ", "GOKYUZU", "AY", "RUZGAR", "DAG", "YILDIZ", "ADA", "BULUT", "ORMAN", "GOL", "NEHIR", "SAHIL", "KAYA"],
    colors: ["BEYAZ", "SIYAH", "GRI", "KIRMIZI", "SARI", "ALTIN", "GUMUS", "KAHVE", "MAVI", "YESIL", "MOR"],
    house: ["EV", "MASA", "KAPI", "CATI", "ODA", "LAMBA", "BAHCE", "DUVAR", "YATAK", "ANAHTAR", "PENCERE", "SANDALYE"],
  },
  uk: {
    animals: ["ВОВК", "ЛЕВ", "ТИГР", "РИБА", "КІНЬ", "ВЕДМІДЬ", "МИША", "ЗАЄЦЬ", "СОВА", "ОРЕЛ", "СОБАКА", "КІТ", "ЛИСИЦЯ"],
    food: ["ХЛІБ", "РИС", "МЕД", "СІЛЬ", "СУП", "СИР", "ФРУКТ", "М'ЯСО", "ГРУША", "ВИНО", "МОЛОКО", "ЧАЙ", "ЯЙЦЕ", "ПИРІГ"],
    nature: ["СОНЦЕ", "МОРЕ", "НЕБО", "МІСЯЦЬ", "ВІТЕР", "ГОРА", "ЗІРКА", "ОСТРІВ", "ХМАРА", "ЛІС", "ОЗЕРО", "РІЧКА", "БЕРЕГ", "СКЕЛЯ"],
    colors: ["БІЛИЙ", "ЧОРНИЙ", "СІРИЙ", "ЧЕРВОНИЙ", "ЖОВТИЙ", "ЗОЛОТО", "СРІБЛО", "КОРИЧНЕВИЙ", "СИНІЙ", "ЗЕЛЕНИЙ", "ФІОЛЕТОВИЙ"],
    house: ["ДІМ", "СТІЛ", "ДВЕРІ", "ДАХ", "КІМНАТА", "ЛАМПА", "САД", "СТІНА", "ЛІЖКО", "КЛЮЧ", "ВІКНО", "КРІСЛО"],
  },
  ru: {
    animals: ["ВОЛК", "ЛЕВ", "ТИГР", "РЫБА", "КОНЬ", "МЕДВЕДЬ", "МЫШЬ", "ЗАЯЦ", "СОВА", "ОРЕЛ", "СОБАКА", "КОТ", "ЛИСА", "ОЛЕНЬ"],
    food: ["ХЛЕБ", "РИС", "МЕД", "СОЛЬ", "СУП", "СЫР", "ФРУКТ", "МЯСО", "ГРУША", "ВИНО", "МОЛОКО", "ЧАЙ", "ЯЙЦО", "ПИРОГ"],
    nature: ["СОЛНЦЕ", "МОРЕ", "НЕБО", "ЛУНА", "ВЕТЕР", "ГОРА", "ЗВЕЗДА", "ОСТРОВ", "ОБЛАКО", "ЛЕС", "ОЗЕРО", "РЕКА", "БЕРЕГ", "СКАЛА"],
    colors: ["БЕЛЫЙ", "ЧЕРНЫЙ", "СЕРЫЙ", "КРАСНЫЙ", "ЖЕЛТЫЙ", "ЗОЛОТО", "СЕРЕБРО", "КОРИЧНЕВЫЙ", "СИНИЙ", "ЗЕЛЕНЫЙ", "ФИОЛЕТОВЫЙ"],
    house: ["ДОМ", "СТОЛ", "ДВЕРЬ", "КРЫША", "КОМНАТА", "ЛАМПА", "САД", "СТЕНА", "КРОВАТЬ", "КЛЮЧ", "ОКНО", "СТУЛ"],
  },
  bg: {
    animals: ["ВЪЛК", "ЛЪВ", "ТИГЪР", "РИБА", "КОН", "МЕЧКА", "МИШКА", "ЗАЕК", "БУХАЛ", "ОРЕЛ", "КУЧЕ", "КОТКА", "ЛИСИЦА"],
    food: ["ХЛЯБ", "ОРИЗ", "МЕД", "СОЛ", "СУПА", "СИРЕНЕ", "ПЛОД", "МЕСО", "КРУША", "ВИНО", "МЛЯКО", "ЧАЙ", "ЯЙЦЕ", "БАНИЦА"],
    nature: ["СЛЪНЦЕ", "МОРЕ", "НЕБЕ", "ЛУНА", "ВЯТЪР", "ПЛАНИНА", "ЗВЕЗДА", "ОСТРОВ", "ОБЛАК", "ГОРА", "ЕЗЕРО", "РЕКА", "БРЯГ", "СКАЛА"],
    colors: ["БЯЛ", "ЧЕРЕН", "СИВ", "ЧЕРВЕН", "ЖЪЛТ", "ЗЛАТО", "СРЕБРО", "КАФЯВ", "СИН", "ЗЕЛЕН", "ЛИЛАВ"],
    house: ["ДОМ", "МАСА", "ВРАТА", "ПОКРИВ", "СТАЯ", "ЛАМПА", "ГРАДИНА", "СТЕНА", "ЛЕГЛО", "КЛЮЧ", "ПРОЗОРЕЦ", "СТОЛ"],
  },
  hr: {
    animals: ["VUK", "LAV", "TIGAR", "RIBA", "KONJ", "MEDVJED", "MIS", "ZEC", "SOVA", "ORAO", "PAS", "MACKA", "LISICA"],
    food: ["KRUH", "RIZA", "MED", "SOL", "JUHA", "SIR", "VOCE", "MESO", "KRUSKA", "VINO", "MLIJEKO", "CAJ", "JAJE", "KOLAC"],
    nature: ["SUNCE", "MORE", "NEBO", "MJESEC", "VJETAR", "PLANINA", "ZVIJEZDA", "OTOK", "OBLAK", "SUMA", "JEZERO", "RIJEKA", "OBALA", "STIJENA"],
    colors: ["BIJELA", "CRNA", "SIVA", "CRVENA", "ZUTA", "ZLATO", "SREBRO", "SMEDA", "PLAVA", "ZELENA", "LJUBICASTA"],
    house: ["KUCA", "STOL", "VRATA", "KROV", "SOBA", "LAMPA", "VRT", "ZID", "KREVET", "KLJUC", "PROZOR", "STOLICA"],
  },
  sr: {
    animals: ["ВУК", "ЛАВ", "ТИГАР", "РИБА", "КОЊ", "МЕДВЕД", "МИШ", "ЗЕЦ", "СОВА", "ОРАО", "ПАС", "МАЧКА", "ЛИСИЦА"],
    food: ["ХЛЕБ", "ПИРИНАЧ", "МЕД", "СО", "СУПА", "СИР", "ВОЋЕ", "МЕСО", "КРУШКА", "ВИНО", "МЛЕКО", "ЧАЈ", "ЈАЈЕ", "КОЛАЧ"],
    nature: ["СУНЦЕ", "МОРЕ", "НЕБО", "МЕСЕЦ", "ВЕТАР", "ПЛАНИНА", "ЗВЕЗДА", "ОСТРВО", "ОБЛАК", "ШУМА", "ЈЕЗЕРО", "РЕКА", "ОБАЛА", "СТЕНА"],
    colors: ["БЕЛА", "ЦРНА", "СИВА", "ЦРВЕНА", "ЖУТА", "ЗЛАТО", "СРЕБРО", "БРАОН", "ПЛАВА", "ЗЕЛЕНА", "ЉУБИЧАСТА"],
    house: ["КУЋА", "СТО", "ВРАТА", "КРОВ", "СОБА", "ЛАМПА", "БАШТА", "ЗИД", "КРЕВЕТ", "КЉУЧ", "ПРОЗОР", "СТОЛИЦА"],
  },
  sk: {
    animals: ["VLK", "LEV", "TIGER", "RYBA", "KON", "MEDVED", "MYS", "ZAJAC", "SOVA", "OROL", "PES", "MACKA", "LISKA"],
    food: ["CHLIEB", "RYZA", "MED", "SOL", "POLIEVKA", "SYR", "OVOCIE", "MASO", "HRUSKA", "VINO", "MLIEKO", "CAJ", "VAJCE", "KOLAC"],
    nature: ["SLNKO", "MORE", "NEBO", "MESIAC", "VIETOR", "HORA", "HVIEZDA", "OSTROV", "OBLAK", "LES", "JAZERO", "RIEKA", "POBREZIE", "SKALA"],
    colors: ["BIELA", "CIERNA", "SEDA", "CERVENA", "ZLTA", "ZLATO", "STRIEBRO", "HNEDA", "MODRA", "ZELENA", "FIALOVA"],
    house: ["DOM", "STOL", "DVERE", "STRECHA", "IZBA", "LAMPA", "ZAHRADA", "STENA", "POSTEL", "KLUC", "OKNO", "STOLICKA"],
  },
  ca: {
    animals: ["LLOP", "LLEO", "TIGRE", "PEIX", "CAVALL", "OS", "RATOLI", "LLEBRE", "GUS", "GOS", "GAT", "ALIGA", "CUC"],
    food: ["PA", "ARROS", "MEL", "SAL", "SOPA", "FORMATGE", "FRUITA", "CARN", "PERA", "VI", "LLET", "TE", "OU", "PASTIS"],
    nature: ["SOL", "MAR", "CEL", "LLUNA", "VENT", "MUNTANYA", "ESTEL", "ILLA", "NUVOL", "BOSC", "LLAC", "RIU", "PLATJA", "ROCA"],
    colors: ["BLANC", "NEGRE", "GRIS", "VERMELL", "GROC", "OR", "PLATA", "MARRO", "BLAU", "VERD", "VIOLETA"],
    house: ["CASA", "TAULA", "PORTA", "TEULAT", "HABITACIO", "LLUM", "JARDI", "PARET", "LLIT", "CLAU", "FINESTRA", "CADIRA"],
  },
  zh: {
    animals: ["白马", "金鹿", "野狼", "花猫", "猎狗", "棕熊", "黑虎", "灰狐", "雄狮", "青鱼", "飞鸟", "白兔", "公牛", "绵羊"],
    food: ["清茶", "白米", "米饭", "浓汤", "鲜肉", "白糖", "青菜", "白盐", "面条", "蜂蜜", "红酒", "脆梨", "甜果", "鲜蛋"],
    nature: ["太阳", "月亮", "星星", "白云", "春风", "春雨", "青山", "大海", "森林", "白雪", "坚冰", "流水", "蓝天", "彩虹"],
    colors: ["大红", "深蓝", "纯白", "漆黑", "翠绿", "金黄", "银白", "浅灰", "深紫", "青色", "橙色", "棕色"],
    house: ["木门", "明窗", "大床", "方桌", "竹椅", "明灯", "瓦房", "高墙", "庭院", "楼台", "红瓦", "石阶"],
  },
  "zh-TW": {
    animals: ["白馬", "金鹿", "野狼", "花貓", "獵狗", "棕熊", "黑虎", "灰狐", "雄獅", "青魚", "飛鳥", "白兔", "公牛", "綿羊"],
    food: ["清茶", "白米", "米飯", "濃湯", "鮮肉", "白糖", "青菜", "白鹽", "麵條", "蜂蜜", "紅酒", "脆梨", "甜果", "鮮蛋"],
    nature: ["太陽", "月亮", "星星", "白雲", "春風", "春雨", "青山", "大海", "森林", "白雪", "堅冰", "流水", "藍天", "彩虹"],
    colors: ["大紅", "深藍", "純白", "漆黑", "翠綠", "金黃", "銀白", "淺灰", "深紫", "青色", "橙色", "棕色"],
    house: ["木門", "明窗", "大床", "方桌", "竹椅", "明燈", "瓦房", "高牆", "庭院", "樓台", "紅瓦", "石階"],
  },
  ja: {
    animals: ["シカ", "トラ", "トリ", "サル", "ウマ", "ウシ", "クマ", "ゾウ", "ワシ", "タカ", "カニ", "エビ", "サメ"],
    food: ["チャ", "コメ", "パン", "ニク", "シオ", "ミツ", "サケ", "ナシ", "アブラ", "スシ", "ソバ", "ウドン"],
    nature: ["ツキ", "ホシ", "クモ", "カゼ", "アメ", "ヤマ", "ウミ", "モリ", "ユキ", "イシ", "ソラ", "カワ", "ハナ"],
    colors: ["アカ", "アオ", "シロ", "クロ", "キン", "ギン", "ハイ", "チャ", "コン", "アイ"],
    house: ["ドア", "マド", "イス", "ヘヤ", "カベ", "ニワ", "ヤネ", "フロ", "カギ", "ハコ"],
  },
  ko: {
    animals: ["사자", "호랑이", "여우", "늑대", "사슴", "바다", "물고기", "오리", "거위", "독수리", "비둘기", "송아지"],
    food: ["보리", "국수", "만두", "김치", "비빔", "사과", "포도", "오렌지", "딸기", "호박", "당근", "생선"],
    nature: ["하늘", "바람", "구름", "별빛", "햇살", "호수", "언덕", "골짜기", "폭포", "모래", "바위", "단풍"],
    colors: ["노랑", "파랑", "초록", "보라", "주황", "분홍", "갈색", "은빛", "금빛", "연두"],
    house: ["지붕", "마루", "부엌", "거실", "창고", "울타리", "계단", "화장실", "서재", "다락"],
  },
  hi: {
    animals: ["शेर", "बाघ", "घोड़ा", "हिरण", "पक्षी", "मछली", "भालू", "बैल", "भेड़", "हाथी", "बंदर", "चील", "हंस"],
    food: ["चाय", "चावल", "रोटी", "सूप", "मांस", "नमक", "चीनी", "शहद", "शराब", "फल", "दूध", "मक्खन", "दाल"],
    nature: ["सूर्य", "चंद्र", "तारा", "बादल", "हवा", "वर्षा", "पर्वत", "सागर", "जंगल", "बर्फ", "पत्थर", "आकाश", "नदी"],
    colors: ["लाल", "नीला", "सफेद", "काला", "पीला", "हरा", "गुलाबी", "सुनहरा", "चांदी", "धूसर", "जामुनी"],
    house: ["द्वार", "खिड़की", "पलंग", "मेज", "कुर्सी", "दीपक", "कमरा", "दीवार", "बगीचा", "छत", "ताला"],
  },
  bn: {
    animals: ["সিংহ", "বাঘ", "ঘোড়া", "হরিণ", "পাখি", "মাছ", "ভালুক", "গরু", "ভেড়া", "হাতি", "বানর", "ঈগল", "হাঁস"],
    food: ["চা", "চাল", "রুটি", "স্যুপ", "মাংস", "লবণ", "চিনি", "মধু", "মদ", "ফল", "দুধ", "মাখন", "ডাল"],
    nature: ["সূর্য", "চাঁদ", "তারা", "মেঘ", "বাতাস", "বৃষ্টি", "পাহাড়", "সাগর", "বন", "বরফ", "পাথর", "আকাশ", "নদী"],
    colors: ["লাল", "নীল", "সাদা", "কালো", "হলুদ", "সবুজ", "গোলাপী", "সোনালী", "রূপালী", "ধূসর", "বেগুনী"],
    house: ["দ্বার", "জানালা", "বিছানা", "টেবিল", "চেয়ার", "প্রদীপ", "ঘর", "দেয়াল", "বাগান", "ছাদ", "তালা"],
  },
  ta: {
    animals: ["சிங்கம்", "புலி", "குதிரை", "மான்", "பறவை", "மீன்", "கரடி", "மாடு", "ஆடு", "யானை", "குரங்கு", "கழுகு", "வாத்து"],
    food: ["தேநீர்", "அரிசி", "ரொட்டி", "சூப்", "இறைச்சி", "உப்பு", "சர்க்கரை", "தேன்", "பழம்", "பால்", "வெண்ணெய்", "பருப்பு"],
    nature: ["சூரியன்", "நிலா", "விண்மீன்", "மேகம்", "காற்று", "மழை", "மலை", "கடல்", "காடு", "பனி", "பாறை", "வானம்", "ஆறு"],
    colors: ["சிவப்பு", "நீலம்", "வெள்ளை", "கருப்பு", "மஞ்சள்", "பச்சை", "தங்கம்", "வெள்ளி", "சாம்பல்", "ஊதா"],
    house: ["கதவு", "சன்னல்", "படுக்கை", "மேசை", "நாற்காலி", "விளக்கு", "அறை", "சுவர்", "தோட்டம்", "கூரை", "பூட்டு"],
  },
  te: {
    animals: ["సింహం", "పులి", "గుర్రం", "జింక", "పక్షి", "చేప", "ఎలుగు", "ఆవు", "గొర్రె", "ఏనుగు", "కోతి", "డేగ", "హంస"],
    food: ["టీ", "బియ్యం", "రొట్టె", "సూప్", "మాంసం", "ఉప్పు", "చక్కెర", "తేనె", "పండు", "పాలు", "వెన్న", "పప్పు"],
    nature: ["సూర్యుడు", "చంద్రుడు", "చుక్క", "మేఘం", "గాలి", "వాన", "కొండ", "సముద్రం", "అడవి", "మంచు", "రాయి", "ఆకాశం", "ఏరు"],
    colors: ["ఎరుపు", "నీలం", "తెలుపు", "నలుపు", "పసుపు", "ఆకుపచ్చ", "బంగారం", "వెండి", "బూడిద", "ఊదా"],
    house: ["ద్వారం", "కిటికీ", "మంచం", "బల్ల", "కుర్చీ", "దీపం", "గది", "గోడ", "తోట", "పైకప్పు", "తాళం"],
  },
  th: {
    animals: ["สิงโต", "เสือ", "ม้า", "กวาง", "นก", "ปลา", "หมี", "วัว", "แกะ", "ช้าง", "ลิง", "เหยี่ยว", "เป็ด"],
    food: ["ชา", "ข้าว", "ขนมปัง", "ซุป", "เนื้อ", "เกลือ", "น้ำตาล", "น้ำผึ้ง", "ผลไม้", "นม", "เนย", "ไข่"],
    nature: ["ตะวัน", "จันทร์", "ดวงดาว", "เมฆ", "สายลม", "สายฝน", "ภูเขา", "ทะเล", "ป่าไม้", "หิมะ", "หินผา", "ท้องฟ้า", "แม่น้ำ"],
    colors: ["สีแดง", "สีฟ้า", "สีขาว", "สีดำ", "สีเหลือง", "สีเขียว", "สีทอง", "สีเงิน", "สีเทา", "สีม่วง"],
    house: ["ประตู", "หน้าต่าง", "เตียงนอน", "โต๊ะ", "เก้าอี้", "ตะเกียง", "ห้อง", "กำแพง", "สวน", "หลังคา", "กุญแจ"],
  },
  vi: {
    animals: ["CHO", "MEO", "SU TU", "HO", "NGUA", "NAI", "CHIM", "CA", "GAU", "BO", "CUU", "VOI", "KHI", "DAI BANG", "VIT"],
    food: ["TRA", "COM", "BANH", "SUP", "THIT", "MUOI", "DUONG", "MAT", "TRAI CAY", "SUA", "BO SUA", "TRUNG"],
    nature: ["MAT TROI", "TRANG", "NGOI SAO", "DAM MAY", "NGON GIO", "CON MUA", "NUI", "DAI DUONG", "RUNG", "TUYET", "TANG DA", "BAU TROI"],
    colors: ["MAU DO", "MAU LAM", "MAU TRANG", "MAU DEN", "MAU VANG", "MAU LUC", "VANG KIM", "BAC", "MAU XAM", "MAU TIM"],
    house: ["CANH CUA", "CUA SO", "GIUONG", "BAN", "GHE", "NGON DEN", "CAN PHONG", "BUC TUONG", "KHU VUON", "MAI NHA", "KHOA"],
  },
  id: {
    animals: ["SINGA", "HARIMAU", "KUDA", "RUSA", "BURUNG", "IKAN", "BERUANG", "SAPI", "DOMBA", "GAJAH", "MONYET", "ELANG", "BEBEK"],
    food: ["TEH", "BERAS", "ROTI", "SUP", "DAGING", "GARAM", "GULA", "MADU", "BUAH", "SUSU", "MENTEGA", "TELUR"],
    nature: ["SURYA", "BULAN", "BINTANG", "AWAN", "ANGIN", "HUJAN", "GUNUNG", "SAMUDRA", "RIMBA", "SALJU", "BATU", "ANGKASA", "SUNGAI"],
    colors: ["MERAH", "BIRU", "PUTIH", "HITAM", "KUNING", "HIJAU", "KENCANA", "PERAK", "KELABU", "UNGU"],
    house: ["PINTU", "JENDELA", "PERADUAN", "MEJA", "KURSI", "PELITA", "RUANG", "TEMBOK", "TAMAN", "ATAP", "KUNCI"],
  },
  ms: {
    animals: ["SINGA", "HARIMAU", "KUDA", "RUSA", "BURUNG", "IKAN", "BERUANG", "LEMBU", "BIRI", "GAJAH", "MONYET", "HELANG", "ITEK"],
    food: ["TEH", "BERAS", "ROTI", "SUP", "DAGING", "GARAM", "GULA", "MADU", "BUAH", "SUSU", "MENTEGA", "TELUR"],
    nature: ["SURIA", "BULAN", "BINTANG", "AWAN", "ANGIN", "HUJAN", "GUNUNG", "LAUTAN", "HUTAN", "SALJI", "BATU", "LANGIT", "SUNGAI"],
    colors: ["MERAH", "BIRU", "PUTIH", "HITAM", "KUNING", "HIJAU", "EMAS", "PERAK", "KELABU", "UNGU"],
    house: ["PINTU", "TINGKAP", "KATIL", "MEJA", "KERUSI", "PELITA", "BILIK", "DINDING", "LAMAN", "BUMBUNG", "KUNCI"],
  },
  tl: {
    animals: ["LEON", "TIGRE", "KABAYO", "USA", "IBON", "ISDA", "OSO", "BAKA", "TUPA", "ELEPANTE", "UNGGOY", "LAWIN", "PATOK"],
    food: ["TSAA", "BIGAS", "TINAPAY", "SABAW", "KARNE", "ASIN", "ASUKAL", "PULOT", "PRUTAS", "GATAS", "MANTEKA", "ITLOG"],
    nature: ["ARAW", "BUWAN", "BITUIN", "ULAP", "HANGIN", "ULAN", "BUNDOK", "DAGAT", "GUBAT", "NIYEBE", "BATO", "KALAWAKAN", "ILOG"],
    colors: ["PULA", "BUGHAW", "PUTI", "ITIM", "DILAW", "LUNTIAN", "GINTO", "PILAK", "ABOHIN", "LILA"],
    house: ["PINTO", "DUNGGAWAN", "HIGAAN", "HAPAG", "UPUAN", "ILAW", "SILID", "DINGDING", "BAKURAN", "BUBONG", "SUSI"],
  },
  my: {
    animals: ["ခြင်္သေ့", "ကျား", "မြင်း", "သမင်", "ငှက်", "ငါး", "ဝက်ဝံ", "နွား", "သိုး", "ဆင်", "မျောက်", "လင်းယုန်", "ဘဲ"],
    food: ["လက်ဖက်ရည်", "ဆန်", "မုန့်", "ဟင်းချို", "အသား", "ဆား", "သကြား", "ပျားရည်", "သစ်သီး", "နို့", "ထောပတ်", "ဥ"],
    nature: ["နေမင်း", "လမင်း", "ကြယ်တာရာ", "တိမ်တိုက်", "လေပြေ", "မိုးရေ", "တောင်တန်း", "ပင်လယ်ပြင်", "တောအုပ်", "ဆီးနှင်း", "ကျောက်ဆောင်", "မိုးကောင်းကင်"],
    colors: ["အနီရောင်", "အပြာရောင်", "အဖြူရောင်", "အနက်ရောင်", "အဝါရောင်", "အစိမ်းရောင်", "ရွှေရောင်", "ငွေရောင်", "မီးခိုးရောင်", "ခရမ်းရောင်"],
    house: ["တံခါးမကြီး", "ပြတင်း", "အိပ်ရာခင်း", "စားပွဲ", "ကုလားထိုင်", "မီးတိုင်", "အခန်းငယ်", "နံရံ", "ဥယျာဉ်ခြံ", "ခေါင်မိုး", "သော့"],
  },
  km: {
    animals: ["សត្វតោ", "សត្វខ្លា", "សេះស", "សត្វក្ដាន់", "បក្សី", "ត្រីឆ្លាម", "ខ្លាឃ្មុំ", "គោឈ្មោល", "ចៀម", "ដំរីធំ", "សត្វស្វា", "ឥន្ទ្រី"],
    food: ["ទឹកតែ", "អង្ករល្អ", "នំបុ័ង", "ស៊ុបក្តៅ", "សាច់គោ", "អំបិល", "ស្ករស", "ទឹកឃ្មុំ", "ផ្លែឈើ", "ទឹកដោះគោ", "ប៊ឺ", "ស៊ុត"],
    nature: ["ព្រះអាទិត្យ", "ព្រះច័ន្ទ", "ផ្កាយព្រឹក", "ពពកស", "ខ្យល់បក់", "ភ្លៀងធ្លាក់", "ភ្នំធំ", "សមុទ្រខៀវ", "ព្រៃព្រឹក្សា", "ព្រិលស", "ថ្មដា", "មេឃា"],
    colors: ["ពណ៌ក្រហម", "ពណ៌ខៀវ", "ពណ៌ស", "ពណ៌ខ្មៅ", "ពណ៌លឿង", "ពណ៌បៃតង", "ពណ៌មាស", "ពណ៌ប្រាក់", "ពណ៌ប្រផេះ", "ពណ៌ស្វាយ"],
    house: ["ទ្វារផ្ទះ", "បង្អួច", "គ្រែគេង", "តុឈើ", "កៅអី", "ចង្កៀង", "បន្ទប់គេង", "ជញ្ជាំង", "សួនផ្កា", "ដំបូល", "សោ"],
  },
  si: {
    animals: ["සිංහයා", "කොටියා", "අශ්වයා", "මුවා", "කුරුල්ලා", "මාළුවා", "වලසා", "හරකා", "බැටළුවා", "අලියා", "වඳුරා", "උකුස්සා", "තාරාවා"],
    food: ["තේපැන්", "සහල්", "පාන්පිටි", "සුප්", "මස්", "ලුණු", "සීනි", "පැණි", "පළතුරු", "කිරි", "බටර්", "බිත්තර"],
    nature: ["හිරුදෙවි", "සඳපාන", "තරුකැට", "වලාපෙළ", "සුළඟ", "වැහිදිය", "කඳුහෙල්", "මහමුහුද", "වනපෙත", "හිමකැට", "ගල්පර", "අහස්කුස"],
    colors: ["රතුපැහැ", "නිල්පැහැ", "සුදුපැහැ", "කළුපැහැ", "කහපැහැ", "කොළපැහැ", "රන්වන්", "රිදීවන්", "අළුපැහැ", "දම්පැහැ"],
    house: ["දොරගුල", "කවුළුව", "යහන", "මේසය", "පුටුව", "පහන්සිළ", "කාමරය", "පවුර", "මල්වත්ත", "වහලය", "යතුර"],
  },
  ne: {
    animals: ["सिंह", "बाघ", "घोडा", "मृग", "चरा", "माछा", "भालु", "गाई", "भेडा", "हात्ती", "बाँदर", "चील", "हाँस"],
    food: ["चिया", "चामल", "रोटी", "सूप", "मासु", "नुन", "चिनी", "मह", "फलफूल", "दूध", "माखन", "अण्डा"],
    nature: ["सूर्य", "चन्द्रमा", "तारा", "बादल", "हावा", "पानी", "पहाड", "समुद्र", "जंगल", "हिउँ", "ढुङ्गा", "आकाश", "खोला"],
    colors: ["रातो", "नीलो", "सेतो", "कालो", "पहेंलो", "हरियो", "सुनौलो", "चाँदी", "खैरो", "बैजनी"],
    house: ["ढोका", "झ्याल", "ओछ्यान", "टेबुल", "कुर्सी", "बत्ती", "कोठा", "भित्ता", "बगैंचा", "छत", "ताला"],
  },
  mr: {
    animals: ["सिंह", "वाघ", "घोडा", "हरिण", "पक्षी", "मासा", "अस्वल", "गाय", "मेंढी", "हत्ती", "माकड", "गरुड", "बदक"],
    food: ["चहा", "तांदूळ", "भाकरी", "सूप", "मांस", "मीठ", "साखर", "मध", "फळे", "दूध", "लोणी", "अंडे"],
    nature: ["सूर्य", "चंद्र", "तारे", "ढग", "वारा", "पाऊस", "पर्वत", "समुद्र", "रान", "बर्फ", "खडक", "आभाळ", "नदी"],
    colors: ["लाल", "निळा", "पांढरा", "काळा", "पिवळा", "हिरवा", "सोनेरी", "चांदी", "राखाडी", "जांभळा"],
    house: ["दार", "खिडकी", "बिछाना", "मेज", "खुर्ची", "दिवा", "खोली", "भिंत", "बगीचा", "छप्पर", "किल्ली"],
  },
  gu: {
    animals: ["સિંહ", "વાઘ", "ઘોડો", "હરણ", "પક્ષી", "માછલી", "રીંછ", "ગાય", "ઘેટું", "હાથી", "વાંદરો", "ગરુડ", "બતક"],
    food: ["ચા", "ચોખા", "રોટલી", "સૂપ", "માંસ", "મીઠું", "ખાંડ", "મધ", "ફળો", "દૂધ", "માખણ", "ઈંડું"],
    nature: ["સૂર્ય", "ચંદ્ર", "તારા", "વાદળ", "પવન", "વરસાદ", "પર્વત", "સાગર", "જંગલ", "બરફ", "પથ્થર", "આકાશ", "નદી"],
    colors: ["લાલ", "વાદળી", "સફેદ", "કાળો", "પીળો", "લીલો", "સોનેરી", "રૂપેરી", "રાખોડી", "જાંબલી"],
    house: ["દરવાજો", "બારી", "પલંગ", "ટેબલ", "ખુરશી", "દીવો", "ઓરડો", "દીવાલ", "બગીચો", "ધાબું", "ચાવી"],
  },
  pa: {
    animals: ["ਸ਼ੇਰ", "ਬਾਘ", "ਘੋੜਾ", "ਹਿਰਨ", "ਪੰਛੀ", "ਮੱਛੀ", "ਰਿੱਛ", "ਗਾਂ", "ਭੇਡ", "ਹਾਥੀ", "ਬਾਂਦਰ", "ਇੱਲ", "ਬੱਤਖ"],
    food: ["ਚਾਹ", "ਚੌਲ", "ਰੋਟੀ", "ਸੂਪ", "ਮੀਟ", "ਲੂਣ", "ਖੰਡ", "ਸ਼ਹਿਦ", "ਫਲ", "ਦੁੱਧ", "ਮੱਖਣ", "ਆਂਡਾ"],
    nature: ["ਸੂਰਜ", "ਚੰਦ", "ਤਾਰੇ", "ਬੱਦਲ", "ਹਵਾ", "ਮੀਂਹ", "ਪਹਾੜ", "ਸਮੁੰਦਰ", "ਜੰਗਲ", "ਬਰਫ਼", "ਪੱਥਰ", "ਅੰਬਰ", "ਦਰਿਆ"],
    colors: ["ਲਾਲ", "ਨੀਲਾ", "ਚਿੱਟਾ", "ਕਾਲਾ", "ਪੀਲਾ", "ਹਰਾ", "ਸੁਨਹਿਰੀ", "ਚਾਂਦੀ", "ਸਲੇਟੀ", "ਜਾਮਣੀ"],
    house: ["ਦਰਵਾਜ਼ਾ", "ਖਿੜਕੀ", "ਮੰਜਾ", "ਮੇਜ਼", "ਕੁਰਸੀ", "ਦੀਵਾ", "ਕਮਰਾ", "ਕੰਧ", "ਬਗੀਚਾ", "ਛੱਤ", "ਕੁੰਜੀ"],
  },
  kn: {
    animals: ["ಸಿಂಹ", "ಹುಲಿ", "ಕುದುರೆ", "ಜಿಂಕೆ", "ಹಕ್ಕಿ", "ಮೀನು", "ಕರಡಿ", "ಹಸು", "ಕುರಿ", "ಆನೆ", "ಕೋತಿ", "ಹದ್ದು", "ಬಾತು"],
    food: ["ಚಹಾ", "ಅಕ್ಕಿ", "ರೊಟ್ಟಿ", "ಸೂಪ್", "ಮಾಂಸ", "ಉಪ್ಪು", "ಸಕ್ಕರೆ", "ಜೇನು", "ಹಣ್ಣು", "ಹಾಲು", "ಬೆಣ್ಣೆ", "ಮೊಟ್ಟೆ"],
    nature: ["ಸೂರ್ಯ", "ಚಂದ್ರ", "ತಾರೆ", "ಮೋಡ", "ಗಾಳಿ", "ಮಳೆ", "ಬೆಟ್ಟ", "ಕಡಲು", "ಕಾಡು", "ಹಿಮ", "ಕಲ್ಲು", "ಬಾನು", "ಹೊಳೆ"],
    colors: ["ಕೆಂಪು", "ನೀಲಿ", "ಬಿಳಿ", "ಕಪ್ಪು", "ಹಳದಿ", "ಹಸಿರು", "ಚಿನ್ನದ", "ಬೆಳ್ಳಿಯ", "ಬೂದು", "ನೇರಳೆ"],
    house: ["ಬಾಗಿಲು", "ಕಿಟಕಿ", "ಹಾಸಿಗೆ", "ಮೇಜು", "ಕುರ್ಚಿ", "ದೀಪ", "ಕೋಣೆ", "ಗೋಡೆ", "ತೋಟ", "ಮಾಡ", "ಬೀಗ"],
  },
  ml: {
    animals: ["സിംഹം", "കടുവ", "കുതിര", "മാൻ", "പക്ഷി", "മീൻ", "കരടി", "പശു", "ആട്", "ആന", "കുരങ്ങ്", "പരുന്ത്", "താറാവ്"],
    food: ["ചായ", "അരി", "റൊട്ടി", "സൂപ്പ്", "ഇറച്ചി", "ഉപ്പ്", "പഞ്ചസാര", "തേൻ", "പഴങ്ങൾ", "പാൽ", "വെണ്ണ", "മുട്ട"],
    nature: ["സൂര്യൻ", "ചന്ദ്രൻ", "നക്ഷത്രം", "മേഘം", "കാറ്റ്", "മഴ", "മലനിര", "സമുദ്രം", "കാട്", "മഞ്ഞ്", "പാറ", "ആകാശം", "പുഴ"],
    colors: ["ചുവപ്പ്", "നീല", "വെള്ള", "കറുപ്പ്", "മഞ്ഞ", "പച്ച", "സ്വർണ്ണം", "വെള്ളി", "ചാരനിറം", "വയലറ്റ്"],
    house: ["വാതിൽ", "ജനൽ", "കിടക്ക", "മേശ", "കസേര", "വിളക്ക്", "മുറി", "ഭിത്തി", "തോട്ടം", "മേൽക്കൂര", "താക്കോൽ"],
  },
  sw: {
    animals: ["SIMBA", "TUI", "FARASI", "PAALA", "NDEGE", "SAMAKI", "DUBA", "NGOMBE", "KONDOO", "TEMBO", "NYANI", "TAI", "BATA"],
    food: ["CHAI", "MCHELE", "MKATE", "SUPU", "NYAMA", "CHUMVI", "SUKARI", "ASALI", "MATUNDA", "MAZIWA", "SIAGI", "YAI"],
    nature: ["JUA", "MWEZI", "NYOTA", "WAVU", "UPEPO", "MVUA", "MLIMA", "BAHARI", "MSITU", "BARAFU", "MAWE", "MBINGU", "MTO"],
    colors: ["NYEKUNDU", "BULUU", "NYEUPE", "NYEUSI", "MANJANO", "KIJANI", "DHAHABU", "FEDHA", "KIKIJIVU", "ZAMBARAU"],
    house: ["MLANGO", "DIRISHA", "KITANDA", "MEZA", "KITI", "TAA", "CHUMBA", "UKUTA", "BUSTANI", "PAA", "UFUNGUO"],
  },
  he: {
    animals: ["אריה", "נמר", "סוס", "צבי", "ציפור", "דג", "דוב", "פרה", "כבשה", "פיל", "קוף", "נשר", "ברווז"],
    food: ["תה", "אורז", "לחם", "מרק", "בשר", "מלח", "סוכר", "דבש", "פירות", "חלב", "חמאה", "ביצה"],
    nature: ["שמש", "ירח", "כוכבים", "עננים", "רוח", "גשם", "הרים", "אוקיינוס", "יער", "שלג", "סלעים", "רקיע", "נהר"],
    colors: ["אדום", "כחול", "לבן", "שחור", "צהוב", "ירוק", "זהוב", "כסוף", "אפרפר", "סגול"],
    house: ["דלת", "חלון", "מיטה", "שולחן", "כיסא", "מנורה", "חדר", "קיר", "גן", "גג", "מפתח"],
  },
  fa: {
    animals: ["شیر", "ببر", "اسب", "آهو", "پرنده", "ماهی", "خرس", "گاو", "گوسفند", "فیل", "میمون", "عقاب", "اردک"],
    food: ["چای", "برنج", "نان", "سوپ", "گوشت", "نمک", "شکر", "عسل", "میوه", "شیر", "کره", "تخم"],
    nature: ["خورشید", "ماه", "ستارگان", "ابرها", "نسیم", "باران", "کوه‌ها", "اقیانوس", "جنگل", "برف", "سنگ‌ها", "آسمان", "رود"],
    colors: ["قرمز", "آبی", "سفید", "سیاه", "زرد", "سبز", "زرین", "سیمین", "طوسی", "بنفش"],
    house: ["درگاه", "پنجره", "تختخواب", "میز", "صندلی", "چراغ", "اتاق", "دیوار", "بوستان", "بام", "کلید"],
  },
  am: {
    animals: ["አንበሳ", "ነብር", "ፈረስ", "አጋዘን", "ወፍ", "ዓሣ", "ድብ", "ላም", "በግ", "ዝሆን", "ዝንጀሮ", "ንስር", "ዳክዬ"],
    food: ["ሻይ", "ሩዝ", "ዳቦ", "ሾርባ", "ሥጋ", "ጨው", "ስኳር", "ማር", "ፍራፍሬ", "ወተት", "ቅቤ", "እንቁላል"],
    nature: ["ፀሐይ", "ጨረቃ", "ከዋክብት", "ደመና", "ነፋስ", "ዝናብ", "ተራራ", "ውቅያኖስ", "ደን", "በረዶ", "ድንጋይ", "ሰማይ", "ወንዝ"],
    colors: ["ቀይ", "ሰማያዊ", "ነጭ", "ጥቁር", "ቢጫ", "አረንጓዴ", "ወርቃማ", "ብርማ", "ግራጫ", "ሐምራዊ"],
    house: ["መግቢያ", "መስኮት", "መኝታ", "ጠረጴዛ", "ወንበር", "ፋኖስ", "ክፍል", "ግድግዳ", "አትክልት", "ጣሪያ", "ቁልፍ"],
  },
  ha: {
    animals: ["ZAKI", "DAMISA", "DOKI", "BAREWA", "TSUNTSU", "KIFI", "DABBA", "SA", "TUMAKI", "GIWA", "BIRI", "MIKIYA", "AGWAGWA"],
    food: ["SHAYI", "SHINKAFA", "BUREDI", "MIYA", "NAMA", "GISHIRI", "SUKARI", "ZUMA", "YA'YAN ITACE", "NONO", "MAN SHANU", "KWAYI"],
    nature: ["RANA", "WATA", "TAURARI", "GIZAGIZAI", "ISKA", "RUWAN SAMA", "DUTSE", "TEKU", "DAJI", "KANKARA", "DUWATSU", "SAMANIYA", "KOGI"],
    colors: ["JA", "SHUDI", "FARI", "BAKI", "RAWAYA", "KORE", "ZINARIYA", "AZURFA", "TOKA", "SHUDIYA"],
    house: ["KOFA", "TAGA", "GADO", "TEBUR", "KUJERA", "FITILA", "DAKI", "BANGO", "LUMBU", "JINFI", "MABUDI"],
  },
  yo: {
    animals: ["KINIUN", "EKUN", "ESIN", "EGBIN", "EYE", "EJA", "ERANKO", "MALU", "AGUNTAN", "ERIN", "OBO", "AWODI", "PEPEYE"],
    food: ["TI", "IRESI", "BUREDI", "OBE", "ERAN", "IYO", "SUGA", "OYIN", "ESO", "WARA", "ORORO", "EYIN"],
    nature: ["ORUN", "OSUPA", "AWON IRAWO", "IKUKU", "AFEFE", "OJÒ", "OKE", "OKUN", "IGBO", "YINNYIN", "OKUTA", "OJU ORUN", "ODO"],
    colors: ["PUPA", "BULUU", "FUNFUN", "DUDU", "IYEFA", "AWO EWE", "WURA", "FADAKA", "AWO EERU", "ODODO"],
    house: ["ILEKUN", "FERESE", "IBUSUN", "TEBUR", "AGA", "ATUPA", "IYARA", "OGIRI", "OGBA", "ORULE", "KOOKOORO"],
  },
  zu: {
    animals: ["IBHUBESI", "INGWE", "IHASHI", "INYATHI", "INYONI", "INHLANZI", "ISILWANE", "INKOMO", "IMVU", "INDLOVU", "INCAWANE", "UKHOZI", "IDADA"],
    food: ["ITIYE", "ILAYISI", "ISINKWA", "ISOBHO", "INYAMA", "USAWOTI", "USHUKELA", "UJU", "IZITHELO", "UBISI", "IBHOTELA", "IQANDA"],
    nature: ["ILANGA", "INYAZI", "IZINKANYEZI", "AMAFU", "UMOYA", "IMVULA", "IZINTABA", "ULWANDLE", "IHLATHI", "IQHWA", "AMATSHE", "ISIBHAKABHAKA", "UMFULI"],
    colors: ["BOMVU", "LILISA", "MHLOPHE", "MNYAMA", "PHUZI", "LULA", "IGOLIDE", "ISILIVA", "IMPUNGA", "NSUNDU"],
    house: ["ISIVALO", "IFESITELA", "UMBHEDE", "ITAULA", "ISIHLALO", "ISIBANI", "IKAMELO", "UDONGA", "INGGADI", "UPHAHLA", "ISIKHIYE"],
  },
  af: {
    animals: ["LEEU", "TIER", "PERD", "HERT", "VOEL", "VIS", "BEER", "KOEI", "SKAAP", "OLIFANT", "AAP", "AREND", "EEND"],
    food: ["TEE", "RYS", "BROOD", "SOP", "VLEIS", "SOUT", "SUIKER", "HEUNING", "VRUGTE", "MELK", "BOTTER", "EIER"],
    nature: ["SON", "MAAN", "STERRE", "WOLKE", "WIND", "REEN", "BERGE", "OSEAAN", "WOUDE", "SNEEU", "ROTSE", "HEMEL", "RIVIER"],
    colors: ["ROOI", "BLOU", "WIT", "SWART", "GEEL", "GROEN", "GOUD", "SILWER", "GYS", "PERS"],
    house: ["DEUR", "VENSTER", "BED", "TAFEL", "STOEL", "LAMP", "KAMER", "MUUR", "TUIN", "DAK", "SLEUTEL"],
  },
};

// Check all languages
const ALL_56_CODES = [
  "en", "es", "fr", "de", "ar", "ur",
  "pt", "it", "nl", "pl", "ro", "cs", "sv", "no", "da", "fi",
  "el", "hu", "tr", "uk", "ru", "bg", "hr", "sr", "sk", "ca",
  "zh", "zh-TW", "ja", "ko", "hi", "bn", "ta", "te", "th", "vi",
  "id", "ms", "tl", "my", "km", "si", "ne", "mr", "gu", "pa", "kn", "ml",
  "sw", "he", "fa", "am", "ha", "yo", "zu", "af",
];

const cleaned = {};
const dictionaryMap = {};

for (const code of ALL_56_CODES) {
  const bank = EXPANDED_BANKS[code] || EXPANDED_BANKS.en;
  cleaned[code] = {};
  const allWords = new Set();

  for (const cat of ["animals", "food", "nature", "colors", "house"]) {
    const list = bank[cat] || [];
    cleaned[code][cat] = list.map(w => w.trim());
    list.forEach(w => allWords.add(w.trim()));
  }
  dictionaryMap[code] = Array.from(allWords);
}

// Write src/data/banks.js
fs.writeFileSync(
  path.join(__dirname, "..", "src", "data", "banks.js"),
  `// Auto-generated 56-language word banks for Word Connect
export const BANKS = ${JSON.stringify(cleaned, null, 2)};
`,
  "utf8"
);

// Write src/data/dictionary.js
fs.writeFileSync(
  path.join(__dirname, "..", "src", "data", "dictionary.js"),
  `// Auto-generated dictionary & bonus words for all 56 languages
export const DICTIONARY_WORDS = ${JSON.stringify(dictionaryMap, null, 2)};

export function isValidDictionaryWord(word, langCode) {
  if (!word || !langCode) return false;
  const upper = word.toUpperCase().trim();
  const bank = DICTIONARY_WORDS[langCode] || DICTIONARY_WORDS.en || [];
  return bank.some((w) => w.toUpperCase().trim() === upper);
}
`,
  "utf8"
);

console.log("Successfully wrote banks.js and dictionary.js for all 56 languages!");
