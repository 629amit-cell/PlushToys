(() => {
  const categories = [
    { id: "bears", name: "Bears" },
    { id: "cats", name: "Cats" },
    { id: "novelty", name: "Novelty & pillows" },
    { id: "elephants", name: "Elephants" },
    { id: "seasonal", name: "Seasonal" },
    { id: "foxes", name: "Foxes" },
    { id: "sea-life", name: "Sea life" },
    { id: "bunnies", name: "Bunnies" },
    { id: "sloths", name: "Sloths" },
    { id: "wombats", name: "Wombats" },
    { id: "dinosaurs", name: "Dinosaurs" },
    { id: "capybaras", name: "Capybaras" },
    { id: "dogs", name: "Dogs" },
    { id: "birds", name: "Birds" },
    { id: "farmyard", name: "Farm friends" },
    { id: "food-plush", name: "Food plush" },
    { id: "dolls", name: "Dolls & charms" },
  ];

  const additionalProductImages = {
    "mixi-round-cat": ["assets/products/mixi-round-cat-gallery-2.jpg"],
    "mixi-cloud-pillow": ["assets/products/mixi-cloud-pillow-gallery-2.jpg"],
    "mixi-avocado-dinosaur": ["assets/products/mixi-avocado-dinosaur-gallery-2.jpg"],
    "mixi-christmas-dinosaur": ["assets/products/mixi-christmas-dinosaur-gallery-2.jpg"],
    "mixi-capybara": ["assets/products/mixi-capybara-gallery-2.jpg"],
    "mixi-fluffy-fox": ["assets/products/mixi-fluffy-fox-gallery-2.jpg"],
    "mixi-heart-balloon-bear": [
      "https://s.alicdn.com/@sc04/kf/H5815181078554225a4903019282e9487p.jpg_960x960q80.jpg",
    ],
    "mixi-heart-ribbon-bear": [
      "https://s.alicdn.com/@sc04/kf/Hc887770cfd4e41c89505feed63028078S.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/H57108d8ed80649469816e8bebcbc5dacj.png_960x960q80.jpg",
    ],
    "mixi-love-heart-bear": [
      "https://s.alicdn.com/@sc04/kf/Ha53062db1fbe47a09b12cee56bc665b8n.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/H5433c18d7a0f4625bfa52dbba50f51cew.png_960x960q80.jpg",
    ],
    "mixi-heart-cushion": [
      "https://s.alicdn.com/@sc04/kf/H8dec3a36fca2484092c07db12019108bG.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/H22213a44c8a54380af1377bc3f305462M.png_960x960q80.jpg",
    ],
    "mixi-pink-heart-bear": [
      "https://s.alicdn.com/@sc04/kf/Hdca1f7e2cb1d4508986ac9f566040c62h.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/Haa490bf93f22472492b2349eea3ae1f14.png_960x960q80.jpg",
    ],
    "mixi-corduroy-elephant": [
      "https://s.alicdn.com/@sc04/kf/H0f057eb7785c41de9b3f8bc1e011129ee.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/H74845e7020da443dad1385b49ee9df0dj.png_960x960q80.jpg",
    ],
    "mixi-santa-snowman": [
      "https://s.alicdn.com/@sc04/kf/Habc847f0bb5a4ed29c45ac033d319a3ci.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/H0a38da0764c0401cb2392e96a6817bb6u.png_960x960q80.jpg",
    ],
    "mixi-cupid-fox": [
      "https://s.alicdn.com/@sc04/kf/Hcd17fb27d175441981d7b04b1fd37396W.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/Hdbda45c898bc40e88062cbf734da2d68Y.png_960x960q80.jpg",
    ],
    "mixi-whale-pillow": [
      "https://s.alicdn.com/@sc04/kf/H471b546a9ff34f9b9012f230fe46e12ew.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/H5639dbe7dd674767bd4a83bc25a206bc3.png_960x960q80.jpg",
    ],
    "mixi-grey-bunny": [
      "https://s.alicdn.com/@sc04/kf/Hded9c3e30a3f4b6eb9b1666944fe86d73.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/H28f6e1879dd04870a0b62301d37f325dY.png_960x960q80.jpg",
    ],
    "mixi-grey-tabby-cat": [
      "https://s.alicdn.com/@sc04/kf/Hfb3dec9eaadb4726b626ff7daaa1903cW.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/He8c85bfc7c6d4facbc5daa30cb944c736.png_960x960q80.jpg",
    ],
    "mixi-ginger-tabby-cat": [
      "https://s.alicdn.com/@sc04/kf/H43ec941d0ac644808110aad52dfaeb08q.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/Hd966546f3b2f4a86a0bc7a9ee5f1bc44Y.png_960x960q80.jpg",
    ],
    "mixi-red-fox": [
      "https://s.alicdn.com/@sc04/kf/H92b5d848c909451aa7c9b68648aaabcff.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/H3189daf18dc54a54ab764cc1bf5ddf14w.png_960x960q80.jpg",
    ],
    "mixi-christmas-gonks": [
      "https://s.alicdn.com/@sc04/kf/H1c93498b6a3e41479acb5827a71aae329.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/H7f2eaba8d49942f0bd779148a4edc611D.png_960x960q80.jpg",
    ],
    "mixi-christmas-monster": [
      "https://s.alicdn.com/@sc04/kf/H103a49ed3d9e4ae1a264eeda33b2bdacV.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/Hfdfcd8cdffbb4592809e1b85cc780c9d8.png_960x960q80.jpg",
    ],
    "mixi-sloth": [
      "https://s.alicdn.com/@sc04/kf/H06f1c97267c247bfbe47333e7be1f229X.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/Hc41a863f1427415cb568fd4e8b2b053cc.png_960x960q80.jpg",
    ],
    "mixi-wombat": [
      "https://s.alicdn.com/@sc04/kf/H62194fa52a59441eb93131e8efedcceat.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/H3f7dbf6c4c90472fa7f4b36ced8cdd128.png_960x960q80.jpg",
    ],
    "mixi-avocado": [
      "https://s.alicdn.com/@sc04/kf/H51cfd2d374924f9994d57d6d1a326ab6r.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/H4a73855ed60b4eaca905bdd7576f92ac6.png_960x960q80.jpg",
    ],
    "mixi-gingerbread": [
      "https://s.alicdn.com/@sc04/kf/Hb0d45b3a7782455bb7dbe7ff234645aeR.png_960x960q80.jpg",
      "https://s.alicdn.com/@sc04/kf/Hbbb0f99bdc5e43c599d082273b2d22c4O.png_960x960q80.jpg",
    ],
  };

  const products = [
    { id: "mixi-heart-balloon-bear", name: "Heart Balloon Teddy", category: "bears", image: "assets/products/mixi-heart-balloon-bear.jpg" },
    { id: "mixi-heart-ribbon-bear", name: "Heart Ribbon Bear", category: "bears", image: "assets/products/mixi-heart-ribbon-bear.jpg" },
    { id: "mixi-rose-swirl-bear", name: "Rose Teddy Bear", category: "bears", image: "assets/products/mixi-rose-swirl-bear.jpg" },
    { id: "mixi-love-heart-bear", name: "Love Heart Bear", category: "bears", image: "assets/products/mixi-love-heart-bear.jpg" },
    { id: "mixi-heart-cushion", name: "Heart Cushion", category: "novelty", image: "assets/products/mixi-heart-cushion.jpg" },
    { id: "mixi-pink-heart-bear", name: "Pink Heart Bear", category: "bears", image: "assets/products/mixi-pink-heart-bear.jpg" },
    { id: "mixi-corduroy-elephant", name: "Corduroy Elephant", category: "elephants", image: "assets/products/mixi-corduroy-elephant.jpg" },
    { id: "mixi-santa-snowman", name: "Santa & Snowman Plush", category: "seasonal", image: "assets/products/mixi-santa-snowman.jpg" },
    { id: "mixi-cupid-fox", name: "Cupid Fox", category: "foxes", image: "assets/products/mixi-cupid-fox.jpg" },
    { id: "mixi-whale-pillow", name: "Whale Pillow", category: "sea-life", image: "assets/products/mixi-whale-pillow.jpg" },
    { id: "mixi-grey-bunny", name: "Grey Bunny", category: "bunnies", image: "assets/products/mixi-grey-bunny.jpg" },
    { id: "mixi-grey-tabby-cat", name: "Grey Tabby Cat", category: "cats", image: "assets/products/mixi-grey-tabby-cat.jpg" },
    { id: "mixi-ginger-tabby-cat", name: "Ginger Tabby Cat", category: "cats", image: "assets/products/mixi-ginger-tabby-cat.jpg" },
    { id: "mixi-red-fox", name: "Red Fox Plush", category: "foxes", image: "assets/products/mixi-red-fox.jpg" },
    { id: "mixi-christmas-gonks", name: "Christmas Gonk", category: "seasonal", image: "assets/products/mixi-christmas-gonks.jpg" },
    { id: "mixi-christmas-monster", name: "Christmas Monster", category: "seasonal", image: "assets/products/mixi-christmas-monster.jpg" },
    { id: "mixi-sloth", name: "Sloth Plush", category: "sloths", image: "assets/products/mixi-sloth.jpg" },
    { id: "mixi-wombat", name: "Sherpa Wombat", category: "wombats", image: "assets/products/mixi-wombat.jpg" },
    { id: "mixi-avocado", name: "Sherpa Avocado", category: "novelty", image: "assets/products/mixi-avocado.jpg" },
    { id: "mixi-gingerbread", name: "Gingerbread Plush", category: "seasonal", image: "assets/products/mixi-gingerbread.jpg" },
    { id: "mixi-round-cat", name: "Round Cat Plush", category: "cats", image: "assets/products/mixi-round-cat.jpg" },
    { id: "mixi-cloud-pillow", name: "Cloud Pillow", category: "novelty", image: "assets/products/mixi-cloud-pillow.jpg" },
    { id: "mixi-avocado-dinosaur", name: "Avocado Dinosaur", category: "dinosaurs", image: "assets/products/mixi-avocado-dinosaur.jpg" },
    { id: "mixi-christmas-dinosaur", name: "Christmas Tree Dinosaur", category: "dinosaurs", image: "assets/products/mixi-christmas-dinosaur.jpg" },
    { id: "mixi-capybara", name: "Yellow Capybara", category: "capybaras", image: "assets/products/mixi-capybara.jpg" },
    { id: "mixi-fluffy-fox", name: "Fluffy Fox Plush", category: "foxes", image: "assets/products/mixi-fluffy-fox.jpg" },
  ].map((product) => ({
    ...product,
    caption: categories.find((category) => category.id === product.category).name,
    badge: "",
    color: "#f5eee7",
    description: {
      "mixi-heart-balloon-bear": "A teddy bear holding a red, heart-shaped balloon, with a bow at its neck.",
      "mixi-heart-ribbon-bear": "A teddy bear with a heart-patterned ribbon and matching heart details on its paws.",
      "mixi-rose-swirl-bear": "A teddy bear with rose-patterned plush and a coordinating bow tie.",
      "mixi-love-heart-bear": "A teddy bear holding a heart marked “LOVE,” with sequin accents.",
      "mixi-heart-cushion": "A red heart-shaped cushion with a smiling face.",
      "mixi-pink-heart-bear": "A pink teddy bear holding a red heart.",
      "mixi-corduroy-elephant": "A corduroy elephant with pink cheeks and ivory-coloured tusks.",
      "mixi-santa-snowman": "A festive listing featuring Santa and snowman plush characters.",
      "mixi-cupid-fox": "A fox plush with Cupid-inspired wings and heart details.",
      "mixi-whale-pillow": "A large whale-shaped plush pillow with a broad, cushion-like body.",
      "mixi-grey-bunny": "A grey bunny plush with long, floppy ears.",
      "mixi-grey-tabby-cat": "A grey tabby cat plush in a lying-down pose.",
      "mixi-ginger-tabby-cat": "A ginger-coloured tabby cat plush with stripe markings.",
      "mixi-red-fox": "A red fox plush with a pointed muzzle and upright ears.",
      "mixi-christmas-gonks": "A Christmas gonk plush with a tall, knitted-look hat.",
      "mixi-christmas-monster": "A Christmas monster plush shown peeking out of a stocking.",
      "mixi-sloth": "A sloth plush with a relaxed, hanging pose.",
      "mixi-wombat": "A sherpa-style wombat plush with rosy cheeks.",
      "mixi-avocado": "A sherpa-style avocado plush with a smiling face.",
      "mixi-gingerbread": "A gingerbread character plush with a red scarf and corduroy-style texture.",
      "mixi-round-cat": "A round cat plush with cream-coloured patches.",
      "mixi-cloud-pillow": "A cloud-shaped pillow with a smiling face and rosy cheeks.",
      "mixi-avocado-dinosaur": "A green dinosaur plush with an avocado-inspired belly.",
      "mixi-christmas-dinosaur": "A dinosaur plush decorated with Christmas-tree details.",
      "mixi-capybara": "A yellow capybara plush with a sleepy expression.",
      "mixi-fluffy-fox": "An orange fox plush with a full, fluffy tail.",
    }[product.id],
  }));

  const additionalImageUrls = window.LittleWonderAdditionalImageUrls;
  if (!additionalImageUrls) {
    throw new Error("The additional product images did not load.");
  }

  const additionalDescriptions = {
    "1601997687874": "A rabbit plush with a bow detail and soft-looking fur.",
    "1601599663563": "An 80 cm teddy bear with a large, classic bear shape.",
    "1601984481652": "A long-bodied fox plush designed as a hug pillow.",
    "1601402734988": "A plush children's sofa-seat listing featuring bear, panda, unicorn and duck character options.",
    "1601951424117": "A blue shark plush with a recognisable fin and ocean-animal shape.",
    "1600505133691": "A classic teddy bear plush filled with PP cotton, as described in the listing.",
    "1601208310393": "A pair of dressed teddy bears presented together as a matching couple.",
    "1601965815825": "A lamb plush wearing a baker's hat.",
    "1601217965092": "A frog-shaped hand-warmer muff with a sherpa-fleece exterior.",
    "1601965822939": "A puppy plush with grey floppy ears and a bandana.",
    "1601965900193": "A lamb plush dressed in pyjamas and holding a star wand.",
    "1601965799656": "A puppy plush wearing glasses, styled as a photographer.",
    "1601965671012": "A round bird plush with a black beak and yellow chest.",
    "1601965636048": "A cupcake-shaped plush with chocolate-coloured layers.",
    "1601965563375": "A strawberry cake-roll plush keychain with embroidered text.",
    "1601965533448": "A matcha layer-cake plush keychain topped with a cherry.",
    "1601965397803": "A girl doll plush wearing blue striped overalls.",
    "1601965384668": "A penguin cushion with blue zigzag trim.",
    "1601965390528": "A long cat-shaped body pillow wearing a knit hat.",
    "1601965389019": "A toast-shaped cushion with a cream-coloured topping.",
    "1601965331197": "A bear-shaped headboard and backrest pillow.",
    "1601965296351": "A long brown dachshund plush shaped as a body pillow.",
    "1601964843805": "A grey schnauzer plush with a heart charm.",
    "1601964798654": "A pink pig plush wearing a hamburger-shaped hat.",
    "1601964824429": "A cream bunny in a gingham dress, designed as a hanging bag charm.",
    "1601964751330": "A green birthday-cake plush topped with pom-pom-style frosting.",
    "1601964672375": "A persimmon-shaped pillow with green leaf details.",
    "1601964597537": "A round, squishy-style plush ball with a crest detail.",
    "1601964213603": "A rainbow pillow with a face and cloud-shaped design.",
    "1601964218161": "A pink elephant plush wearing a lace-trimmed dress.",
    "1601964044939": "An orange fox plush wearing a striped top with a strawberry detail.",
    "1601964093227": "A chubby grey teddy bear with pink paw details.",
    "1601963957922": "A fluffy white lamb plush with curly horns.",
    "1601962875327": "A blueberry-themed jar plush with heart embroidery.",
    "1601962882307": "A grey penguin plush wearing a beret and holding a paint palette.",
    "1601962844388": "A long, rust-coloured dinosaur plush pillow.",
    "1601962745970": "A green dinosaur plush with a white belly and curled details.",
    "1601962761223": "A spider plush with large, glossy eyes.",
    "1601962670339": "A white duck plush with an orange beak.",
    "1601962592713": "A white ram plush with curly grey horns.",
    "1601962523820": "A brown puppy plush wearing a knit-style sweater.",
    "1601962566435": "A ram plush with curly horns and rainbow-speckled fur.",
    "1601962410000": "A long cat-shaped pillow with calico colouring.",
    "1601949071111": "A baby elephant plush wearing a polka-dot romper and nightcap.",
    "1601519681907": "A cat plush listed by the supplier as a Devon Rex kitten.",
    "1601611828052": "A stegosaurus plush with a row of plates along its back.",
    "1601558925086": "A rabbit plush filled with PP cotton, as described in the listing.",
    "1601951234049": "A flower plush with pom-pom feet and an embroidered face.",
    "1601953987321": "A pink teddy bear with a strawberry-shaped cushion.",
    "1601951434825": "A scarlet macaw plush with a red body and colourful parrot details.",
    "1601952781293": "A cream sheep plush with star-and-moon patches.",
    "1601953365224": "A white teddy bear with a strawberry-cake-shaped body.",
    "1601952108837": "A coral-coloured monster plush with heart-shaped ears and a wink.",
    "1601953801910": "A toucan plush on a wooden perch, with a large black-and-yellow beak.",
    "1601951308587": "An orange-crescent fruit plush with big eyes and a green leaf.",
    "1601953614047": "A green sea-turtle plush with a mottled shell.",
    "1601953402407": "A tiger-striped popsicle plush topped with whipped-cream detail.",
    "1601952641314": "A cream bunny plush wearing a mint dress and carrying a heart purse.",
    "1601952431209": "A cream puppy plush with floppy ears and an eye patch.",
    "1601952368178": "A hamster plush sitting in a cup, with a heart-shaped nose.",
    "1601952275614": "A green Christmas-tree plush topped with a star.",
    "1601952335231": "A potted flower plush with a smiling face and green leaves.",
    "1601715847042": "A hand-shaped animal plush designed for patting and soothing.",
    "1601951949995": "A peach-coloured pig plush with a strawberry bib and fluffy hair detail.",
    "1601951444684": "A pink pig plush wearing a baby bib and ruffled bloomers.",
    "1601951499308": "A cream bunny plush with long-pile fabric and a tulip ribbon charm.",
    "1601951420220": "A teddy bear plush wearing a lace bonnet and purple bow.",
    "1601951169430": "A cream lamb plush in a green velvet-look dress with a burgundy bow.",
    "1601950545660": "A teddy bear plush with popcorn styling and a knit-look LOVE sweater.",
    "1601950913740": "A smiling bamboo-plant plush in a yellow pot.",
    "1601950039277": "A brown beaver plush with buck teeth and a green messenger bag.",
    "1601949989538": "A pink pig plush styled as a hamburger, with cheese and lettuce details.",
    "1601949860992": "A grey gorilla plush with a blue necktie and muscular chest.",
    "1601949153036": "A green dinosaur plush with a spiky back and big smile.",
  };

  const additionalProducts = [
    ["1601997687874", "Bow Bunny", "bunnies"],
    ["1601599663563", "Giant Teddy Bear", "bears"],
    ["1601984481652", "Long Fox Pillow", "foxes"],
    ["1601402734988", "Panda & Unicorn Seat", "novelty"],
    ["1601951424117", "Blue Shark", "sea-life"],
    ["1600505133691", "Classic Teddy Bear", "bears"],
    ["1601208310393", "Teddy Bear Couple", "bears"],
    ["1601965815825", "Baker Lamb", "farmyard"],
    ["1601217965092", "Frog Hand Warmer", "novelty"],
    ["1601965822939", "Bandana Puppy", "dogs"],
    ["1601965900193", "Pajama Lamb", "farmyard"],
    ["1601965799656", "Photographer Puppy", "dogs"],
    ["1601965671012", "Yellow-Chest Bird", "birds"],
    ["1601965636048", "Chocolate Cupcake", "food-plush"],
    ["1601965563375", "Strawberry Cake Roll", "food-plush"],
    ["1601965533448", "Matcha Cake Keychain", "food-plush"],
    ["1601965397803", "Blue Overall Doll", "dolls"],
    ["1601965384668", "Zigzag Penguin Cushion", "birds"],
    ["1601965390528", "Long Cat Body Pillow", "cats"],
    ["1601965389019", "Cream Toast Cushion", "food-plush"],
    ["1601965331197", "Bear Headboard Pillow", "bears"],
    ["1601965296351", "Dachshund Body Pillow", "dogs"],
    ["1601964843805", "Schnauzer Puppy", "dogs"],
    ["1601964798654", "Burger Hat Pig", "farmyard"],
    ["1601964824429", "Gingham Bunny Charm", "bunnies"],
    ["1601964751330", "Birthday Cake", "food-plush"],
    ["1601964672375", "Persimmon Pillow", "food-plush"],
    ["1601964597537", "Crested Plush Ball", "novelty"],
    ["1601964213603", "Rainbow Cloud Pillow", "novelty"],
    ["1601964218161", "Pink Elephant", "elephants"],
    ["1601964044939", "Strawberry Fox", "foxes"],
    ["1601964093227", "Pink-Paw Teddy", "bears"],
    ["1601963957922", "Curly-Horn Lamb", "farmyard"],
    ["1601962875327", "Blueberry Jar", "food-plush"],
    ["1601962882307", "Penguin Artist", "birds"],
    ["1601962844388", "Long Dinosaur Pillow", "dinosaurs"],
    ["1601962745970", "Green Dino", "dinosaurs"],
    ["1601962761223", "Big-Eyed Spider", "novelty"],
    ["1601962670339", "White Duckling", "birds"],
    ["1601962592713", "Curly-Horn Ram", "farmyard"],
    ["1601962523820", "Sweater Puppy", "dogs"],
    ["1601962566435", "Rainbow Ram", "farmyard"],
    ["1601962410000", "Calico Cat Pillow", "cats"],
    ["1601949071111", "Baby Elephant", "elephants"],
    ["1601519681907", "Devon Rex Cat", "cats"],
    ["1601611828052", "Little Stegosaurus", "dinosaurs"],
    ["1601558925086", "Bunny Plush", "bunnies"],
    ["1601951234049", "Pom-Pom Flower", "novelty"],
    ["1601953987321", "Strawberry Bear", "bears"],
    ["1601951434825", "Scarlet Macaw", "birds"],
    ["1601952781293", "Moon & Star Lamb", "farmyard"],
    ["1601953365224", "Strawberry Cake Bear", "bears"],
    ["1601952108837", "Heart-Eared Monster", "novelty"],
    ["1601953801910", "Toucan Plush", "birds"],
    ["1601951308587", "Orange Fruit Plush", "food-plush"],
    ["1601953614047", "Green Sea Turtle", "sea-life"],
    ["1601953402407", "Tiger Popsicle", "food-plush"],
    ["1601952641314", "Mint-Dress Bunny", "bunnies"],
    ["1601952431209", "Eye-Patch Puppy", "dogs"],
    ["1601952368178", "Hamster in a Cup", "novelty"],
    ["1601952275614", "Christmas Tree Plush", "seasonal"],
    ["1601952335231", "Potted Flower", "novelty"],
    ["1601715847042", "Patting Animal Doll", "dolls"],
    ["1601951949995", "Strawberry Bib Pig", "farmyard"],
    ["1601951444684", "Ruffle-Dress Pig", "farmyard"],
    ["1601951499308", "Tulip-Ribbon Bunny", "bunnies"],
    ["1601951420220", "Lace-Bonnet Teddy", "bears"],
    ["1601951169430", "Velvet-Dress Lamb", "farmyard"],
    ["1601950545660", "Popcorn Teddy", "bears"],
    ["1601950913740", "Smiling Bamboo Plant", "novelty"],
    ["1601950039277", "Messenger Beaver", "novelty"],
    ["1601949989538", "Hamburger Pig", "farmyard"],
    ["1601949860992", "Necktie Gorilla", "novelty"],
    ["1601949153036", "Spiky-Back Dino", "dinosaurs"],
  ].map(([id, name, category]) => ({
    id: `mixi-${id}`,
    name,
    category,
    image: additionalImageUrls[`mixi-${id}`],
    caption: categories.find((entry) => entry.id === category).name,
    badge: "",
    color: "#f5eee7",
    description: additionalDescriptions[id],
  }));
  const productWithoutDescription = additionalProducts.find((product) => !product.description);
  if (productWithoutDescription) {
    throw new Error(`Missing product description for ${productWithoutDescription.id}.`);
  }
  const productWithoutImage = additionalProducts.find((product) => !product.image);
  if (productWithoutImage) {
    throw new Error(`Missing product image for ${productWithoutImage.id}.`);
  }
  products.push(...additionalProducts);

  const catalogExpansion = window.LittleWonderCatalogExpansion;
  if (!Array.isArray(catalogExpansion)) {
    throw new Error("The additional plush catalog could not be loaded.");
  }
  const expansionProductIds = new Set(products.map((product) => product.id));
  const invalidExpansionProduct = catalogExpansion.find((product) =>
    !product ||
    !product.id ||
    !product.name ||
    !categories.some((category) => category.id === product.category) ||
    !product.image ||
    !product.description ||
    expansionProductIds.has(product.id)
  );
  if (invalidExpansionProduct) {
    throw new Error(`Invalid or duplicate catalog expansion product: ${invalidExpansionProduct.id || "unknown"}.`);
  }
  products.push(...catalogExpansion.map((product) => ({
    ...product,
    caption: categories.find((category) => category.id === product.category).name,
    badge: "",
    color: "#f5eee7",
  })));

  const formatCurrency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  const productSizes = ["Small", "Medium", "Large"];
  const productSizePriceRanges = {
    Small: { minimum: 200, maximum: 300 },
    Medium: { minimum: 349, maximum: 549 },
    Large: { minimum: 599, maximum: 799 },
  };
  const productSizeHeights = {
    Small: "2 ft",
    Medium: "3.5 ft",
    Large: "6 ft",
  };

  function productPrice(product, size) {
    const range = productSizePriceRanges[size];
    if (!range) throw new RangeError(`Unknown product size: ${size}.`);
    let hash = 2166136261;
    const seed = `${product.id}:${size}`;
    for (let index = 0; index < seed.length; index += 1) {
      hash = Math.imul(hash ^ seed.charCodeAt(index), 16777619);
    }
    return range.minimum + ((hash >>> 0) % (range.maximum - range.minimum + 1));
  }

  function productImageVariant(image, width) {
    const url = new URL(image, window.location.href);
    if (url.hostname !== "s.alicdn.com") return image;
    url.pathname = `${url.pathname.replace(/_\d+x\d+(?:q\d+)?\.(?:jpg|jpeg|png|webp)$/i, "")}_${width}x${width}q100.jpg`;
    return url.toString();
  }

  function productVisual(product, loading = "lazy", size = "full") {
    const widths = size === "card" ? [480, 720, 960] : size === "thumbnail" ? [240, 360, 480] : [];
    const responsiveAttributes = widths.length && productImageVariant(product.image, widths[0]) !== product.image
      ? ` srcset="${widths.map((width) => `${productImageVariant(product.image, width)} ${width}w`).join(", ")}" sizes="${size === "card" ? "(max-width: 600px) 46vw, (max-width: 900px) 30vw, 22vw" : "120px"}"`
      : "";
    return `<img class="product-image" src="${product.image}"${responsiveAttributes} alt="${product.name}" loading="${loading}" decoding="async">`;
  }

  function productImages(product) {
    return [product.image, ...(additionalProductImages[product.id] || [])];
  }

  function readCart() {
    try {
      const saved = JSON.parse(localStorage.getItem("little-wonder-cart") || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.filter((item) =>
        item &&
        products.some((product) => product.id === item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      ).map((item) => ({
        ...item,
        size: productSizes.includes(item.size) ? item.size : "Medium",
      }));
    } catch (error) {
      console.error("Could not read the saved shopping bag.", error);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem("little-wonder-cart", JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error("Could not save the shopping bag in this browser.", error);
      return false;
    }
  }

  window.LittleWonderStore = {
    products,
    categories,
    productSizes,
    productSizePriceRanges,
    productSizeHeights,
    productPrice,
    storageKey: "little-wonder-cart",
    formatCurrency,
    productVisual,
    productImageVariant,
    productImages,
    readCart,
    saveCart,
  };
})();
