(() => {
  const categories = [
    { id: "giant", name: "Giant plush" },
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
      "mixi-heart-balloon-bear": "A classic teddy in soft honey-brown plush, dressed with a neck bow and a glossy red heart balloon. A sweet pick for Valentine's Day, birthdays, or a just-because surprise.",
      "mixi-heart-ribbon-bear": "This teddy wears a heart-print ribbon and carries matching heart accents on its paws. Its soft, huggable shape makes it an easy gift for someone you love.",
      "mixi-rose-swirl-bear": "Swirling rose-pattern fabric gives this teddy its romantic look, finished with a coordinating bow tie. A keepsake-style bear for anniversaries and special occasions.",
      "mixi-love-heart-bear": "A cuddly teddy holds a shining heart marked “LOVE,” with sequin accents that catch the light. Made for grand gestures and everyday reminders alike.",
      "mixi-heart-cushion": "A plump red heart cushion with a cheerful embroidered smile. Tuck it on a bed, sofa, or reading nook for a little extra warmth.",
      "mixi-pink-heart-bear": "A pretty pink teddy with a soft finish and a bright red heart in its paws. A gentle, cheerful gift for birthdays and new arrivals.",
      "mixi-corduroy-elephant": "A textured corduroy elephant with blush-pink cheeks, ivory-toned tusks, and a soft rounded body. Its calm, classic look suits nurseries and grown-up shelves alike.",
      "mixi-santa-snowman": "A festive duo featuring Santa and a snowman in soft plush. Set them out together for a cheerful Christmas display or give them as a pair.",
      "mixi-cupid-fox": "A fox plush with Cupid-inspired wings and heart details, ready for Valentine's gifting. The sweet winged design makes it a playful alternative to a traditional teddy.",
      "mixi-whale-pillow": "A broad, cushion-soft whale pillow with a relaxed, huggable body. Lean it against a headboard or sofa for a playful touch of ocean comfort.",
      "mixi-grey-bunny": "A soft grey bunny with long, floppy ears and a gentle expression. An easy everyday companion for bedtime cuddles and quiet play.",
      "mixi-grey-tabby-cat": "A grey tabby cat plush stretched out in a relaxed lying pose. Its realistic markings and soft body make it a calm companion for cat lovers.",
      "mixi-ginger-tabby-cat": "Warm ginger stripes and a lounging pose give this tabby cat plush its lifelike charm. Settle it on a bed or chair for a cosy, cat-friendly touch.",
      "mixi-red-fox": "A russet-red fox with a pointed muzzle, upright ears, and a bushy tail. Its woodland look makes it a favourite for nature-themed nurseries and playrooms.",
      "mixi-christmas-gonks": "A Christmas gonk with a tall, knitted-look hat and a full white beard. This quirky Nordic-style character brings instant festive cheer to a mantel or sofa.",
      "mixi-christmas-monster": "A playful Christmas monster peeking out of a festive stocking. A fun, light-hearted gift for anyone who likes their holidays a little mischievous.",
      "mixi-sloth": "A laid-back sloth plush with long limbs and a relaxed hanging pose. Made for slow mornings, cosy corners, and anyone who loves a sleepy smile.",
      "mixi-wombat": "A sherpa-textured wombat with a rounded body and rosy cheeks. Its soft, tactile finish makes it a comforting cuddle companion.",
      "mixi-avocado": "A sherpa-style avocado plush with a smiling face and a soft, fuzzy finish. A light-hearted gift for food lovers and desk-side cheer.",
      "mixi-gingerbread": "A gingerbread character in corduroy-look fabric, finished with a bright red scarf. A cosy festive friend for Christmas shelves and gift hampers.",
      "mixi-round-cat": "A plump, round cat with cream-coloured patches and a contented expression. Its compact shape makes it easy to cuddle or perch on a shelf.",
      "mixi-cloud-pillow": "A cloud-shaped pillow with a smiling face and rosy cheeks. Soft and light-hearted, it adds a dreamy touch to a bed or reading corner.",
      "mixi-avocado-dinosaur": "A green dinosaur plush with an avocado-inspired belly and a friendly face. A quirky mash-up for dinosaur fans and food-plush collectors.",
      "mixi-christmas-dinosaur": "A dinosaur plush dressed with Christmas-tree details for a festive twist. A fun stocking filler for dino-mad kids and holiday collectors.",
      "mixi-capybara": "A yellow capybara plush with a sleepy, easy-going expression. Its rounded shape and calm face make it a soothing companion.",
      "mixi-fluffy-fox": "An orange fox with a full, fluffy tail and soft plush fur. A warm woodland friend for cuddles, display, or bedtime.",
    }[product.id],
  }));

  const additionalImageUrls = window.LittleWonderAdditionalImageUrls;
  if (!additionalImageUrls) {
    throw new Error("The additional product images did not load.");
  }

  const additionalDescriptions = {
    "1601997687874": "A soft rabbit plush with a pretty bow and a gentle, round face. Its long ears and cuddly body make it a sweet gift for little ones.",
    "1601599663563": "An 80 cm teddy bear with a large, classic silhouette and plenty of room to hug. A statement gift for birthdays, anniversaries, or room decor.",
    "1601984481652": "A long-bodied fox plush shaped for hugging, with a soft tail and a relaxed pose. Use it as a reading pillow or a cosy companion at bedtime.",
    "1601402734988": "A plush children's sofa seat available in bear, panda, unicorn, and duck styles. A soft, playful spot for reading, snacking, and downtime.",
    "1601951424117": "A blue shark plush with a curved fin and a streamlined ocean-animal shape. A playful pick for sea-life fans and adventurous bedrooms.",
    "1600505133691": "A classic teddy bear with a rounded body, soft plush, and PP-cotton filling. An easy everyday companion for hugs and bedtime.",
    "1601208310393": "A pair of dressed teddy bears presented together as a matching couple. Give them as a set for anniversaries, weddings, or a shared shelf.",
    "1601965815825": "A lamb plush wearing a baker's hat and a cheerful expression. A sweet choice for budding bakers and kitchen-shelf display.",
    "1601217965092": "A frog-shaped hand-warmer muff with a sherpa-fleece exterior and a cosy pocket for cold hands. A fun, practical companion for winter walks.",
    "1601965822939": "A puppy plush with soft grey floppy ears and a bandana at its neck. Its friendly face makes it a loyal-looking cuddle buddy.",
    "1601965900193": "A lamb dressed in cosy pyjamas and holding a star wand. A bedtime-themed friend for sleepyheads and nursery shelves.",
    "1601965799656": "A puppy plush wearing glasses and styled as a photographer. A quirky, characterful gift for creative kids and puppy lovers.",
    "1601965671012": "A round bird plush with a black beak and a bright yellow chest. Its compact, chubby shape fits neatly in a hand or on a shelf.",
    "1601965636048": "A cupcake-shaped plush with chocolate-coloured layers and a swirl of soft frosting. A calorie-free treat for food-plush fans.",
    "1601965563375": "A strawberry cake-roll plush keychain with embroidered text and a sweet, pocket-sized shape. Clip it to a bag or keys for a little dessert cheer.",
    "1601965533448": "A matcha layer-cake plush keychain topped with a cherry. A small, playful accessory for bags, backpacks, and gift toppers.",
    "1601965397803": "A girl doll plush wearing blue striped overalls and a soft, friendly face. A lovely companion for imaginative play and bedroom display.",
    "1601965384668": "A penguin cushion with blue zigzag trim and a plump, supportive shape. Prop it on a sofa or bed for a playful polar touch.",
    "1601965390528": "A long cat-shaped body pillow wearing a knit hat. Its elongated shape is made for hugging, lounging, and bedtime comfort.",
    "1601965389019": "A toast-shaped cushion with a cream-coloured topping and a soft, squishy body. A fun foodie accent for beds, sofas, and desks.",
    "1601965331197": "A bear-shaped headboard and backrest pillow that adds a soft, friendly focal point to a bed. Lean back against it for reading and relaxing.",
    "1601965296351": "A long brown dachshund plush shaped as a body pillow. Its sausage-dog silhouette makes a playful, huggable addition to a bed or sofa.",
    "1601964843805": "A grey schnauzer plush with a heart charm and a characterful beard. A loyal-looking companion for dog lovers of all ages.",
    "1601964798654": "A pink pig plush wearing a hamburger-shaped hat. Silly, sweet, and made for smiles, it suits foodies and playful shelves.",
    "1601964824429": "A cream bunny in a gingham dress, designed as a hanging bag charm. A small, charming accessory for bags, backpacks, and gift wrap.",
    "1601964751330": "A green birthday-cake plush topped with pom-pom-style frosting. A festive, no-calorie centrepiece for birthday displays and gifts.",
    "1601964672375": "A persimmon-shaped pillow with green leaf details and a round, squishy body. A fruitful little accent for a sofa, bed, or reading chair.",
    "1601964597537": "A round, squishy plush ball with a crest detail and a soft, bouncy feel. An easy toss-and-cuddle toy for playrooms and desks.",
    "1601964213603": "A rainbow pillow with a smiling face and cloud-shaped design. Bright and soft, it brings a cheerful touch to a bed or play corner.",
    "1601964218161": "A pink elephant plush wearing a lace-trimmed dress. Its gentle expression and dressed-up look make it a sweet gift for elephant lovers.",
    "1601964044939": "An orange fox plush wearing a striped top with a strawberry detail. A playful character for fox fans and food-themed collections.",
    "1601964093227": "A chubby grey teddy bear with soft pink paw details and a huggable build. A gentle everyday friend for cuddles and bedtime.",
    "1601963957922": "A fluffy white lamb plush with curly horns and a soft, cloud-like coat. A sweet farmyard friend for nurseries and Easter gifting.",
    "1601962875327": "A blueberry-themed jar plush with heart embroidery and a playful foodie shape. A cute desk companion or gift for berry lovers.",
    "1601962882307": "A grey penguin plush wearing a beret and holding a paint palette. A creative character for art lovers and playful shelves.",
    "1601962844388": "A long, rust-coloured dinosaur plush pillow with a soft, stretchy body. Hug it for comfort or use it as a playful bed accent.",
    "1601962745970": "A green dinosaur plush with a white belly and curled details. Its friendly face and soft body make it a dependable cuddle buddy.",
    "1601962761223": "A spider plush with large, glossy eyes and a soft, rounded body. More cute than creepy, it makes a fun gift for bug fans.",
    "1601962670339": "A white duck plush with an orange beak and a soft, round body. A sweet little companion for bathtime, bedtime, or a spring display.",
    "1601962592713": "A white ram plush with curly grey horns and a fluffy coat. A sturdy farmyard friend for cuddles and imaginative play.",
    "1601962523820": "A brown puppy plush wearing a knit-style sweater. Cosy and characterful, it makes a warm-hearted gift for dog lovers.",
    "1601962566435": "A ram plush with curly horns and rainbow-speckled fur. Bright, soft, and a little bit magical, it stands out on any shelf.",
    "1601962410000": "A long cat-shaped pillow with calico colouring and a soft, lounging body. A comfortable companion for beds, sofas, and reading nooks.",
    "1601949071111": "A baby elephant plush wearing a polka-dot romper and nightcap. A sweet, sleepy-time friend for little ones and elephant collectors.",
    "1601519681907": "A cat plush styled after a Devon Rex kitten, with a soft coat and an alert expression. A realistic-looking companion for cat lovers.",
    "1601611828052": "A stegosaurus plush with a row of plates along its back and a friendly face. A gentle first dinosaur for young fans.",
    "1601558925086": "A rabbit plush with soft fur and PP-cotton filling. A simple, huggable companion for bedtime and everyday play.",
    "1601951234049": "A flower plush with pom-pom feet and an embroidered face. A cheerful bloom that never needs watering, perfect for desks and shelves.",
    "1601953987321": "A pink teddy bear holding a strawberry-shaped cushion. A sweet, fruity twist on a classic bear for birthdays and treats.",
    "1601951434825": "A scarlet macaw plush with a red body and colourful parrot details. A bright, tropical companion for bird lovers and playrooms.",
    "1601952781293": "A cream sheep plush with star-and-moon patches and a soft, cuddly coat. A dreamy bedtime friend for little ones.",
    "1601953365224": "A white teddy bear with a strawberry-cake-shaped body and a sweet, dessert-inspired look. A playful gift for food-plush fans.",
    "1601952108837": "A coral-coloured monster plush with heart-shaped ears and a cheeky wink. A lovable little oddball for anyone who likes their cuddles quirky.",
    "1601953801910": "A toucan plush perched on a wooden-style perch, with a large black-and-yellow beak. A colourful character for bird fans and tropical rooms.",
    "1601951308587": "An orange-crescent fruit plush with big eyes and a green leaf. A zesty little companion for food-plush collections and desks.",
    "1601953614047": "A green sea-turtle plush with a mottled shell and soft flippers. A calm ocean friend for cuddles and sea-life displays.",
    "1601953402407": "A tiger-striped popsicle plush topped with whipped-cream detail. A playful dessert-and-animal mash-up for summer gifting.",
    "1601952641314": "A cream bunny plush wearing a mint dress and carrying a heart purse. A dressed-up sweetheart for nursery shelves and gifts.",
    "1601952431209": "A cream puppy plush with floppy ears and a distinctive eye patch. Its scrappy, lovable look makes it a loyal cuddle companion.",
    "1601952368178": "A hamster plush sitting snugly in a cup, with a heart-shaped nose. A tiny, cheerful desk friend or gift for hamster fans.",
    "1601952275614": "A green Christmas-tree plush topped with a star. A soft, kid-friendly decoration for the holidays and a fun gift for tree lovers.",
    "1601952335231": "A potted flower plush with a smiling face and green leaves. A cheerful, low-maintenance bloom for desks, shelves, and windowsills.",
    "1601715847042": "A hand-shaped animal plush designed for patting and soothing. A tactile little companion for gentle play and comfort.",
    "1601951949995": "A peach-coloured pig plush with a strawberry bib and fluffy hair detail. A sweet, dressed-up friend for pig lovers and nurseries.",
    "1601951444684": "A pink pig plush wearing a baby bib and ruffled bloomers. A playful, dressed-up character for cuddles and display.",
    "1601951499308": "A cream bunny plush with long-pile fabric and a tulip ribbon charm. A soft, spring-like friend for Easter and everyday cuddles.",
    "1601951420220": "A teddy bear plush wearing a lace bonnet and purple bow. A vintage-inspired sweetheart for shelves, nurseries, and gifts.",
    "1601951169430": "A cream lamb plush in a green velvet-look dress with a burgundy bow. A dressed-up farmyard friend for special shelves.",
    "1601950545660": "A teddy bear plush with popcorn styling and a knit-look LOVE sweater. A cosy, movie-night-inspired gift for bear collectors.",
    "1601950913740": "A smiling bamboo-plant plush in a yellow pot. A cheerful, no-watering-needed green friend for desks and shelves.",
    "1601950039277": "A brown beaver plush with buck teeth and a green messenger bag. A characterful companion for woodland fans and imaginative play.",
    "1601949989538": "A pink pig plush styled as a hamburger, complete with cheese and lettuce details. A funny foodie gift for burger lovers.",
    "1601949860992": "A grey gorilla plush with a blue necktie and a broad chest. A dapper, characterful companion for desks and shelves.",
    "1601949153036": "A green dinosaur plush with a spiky back and a big smile. A friendly prehistoric pal for playtime and bedtime.",
  };

  const additionalProducts = [
    ["1601997687874", "Bow Bunny", "bunnies"],
    ["1601599663563", "80 cm Giant Teddy Bear", "bears"],
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

  const catalogAmazon = window.LittleWonderCatalogAmazon;
  if (!Array.isArray(catalogAmazon)) {
    throw new Error("The Amazon plush catalog could not be loaded.");
  }
  const amazonProductIds = new Set(products.map((product) => product.id));
  const invalidAmazonProduct = catalogAmazon.find((product) =>
    !product ||
    !product.id ||
    !product.name ||
    !categories.some((category) => category.id === product.category) ||
    !product.image ||
    !product.description ||
    !Array.isArray(product.sizes) ||
    !product.sizes.length ||
    !Number.isFinite(product.price) ||
    amazonProductIds.has(product.id)
  );
  if (invalidAmazonProduct) {
    throw new Error(`Invalid or duplicate Amazon catalog product: ${invalidAmazonProduct.id || "unknown"}.`);
  }
  products.push(...catalogAmazon.map((product) => ({
    ...product,
    caption: categories.find((category) => category.id === product.category).name,
    badge: product.badge || "",
    color: product.color || "#f5eee7",
    collections: Array.isArray(product.collections) ? [...product.collections] : [],
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

  const sizeRankById = new Map([
    ["mixi-1601599663563", 3], // 80 cm Giant Teddy Bear
    ["mixi-1601634793417", 3], // Giant Teddy Bear
    ["mixi-1601673768888", 3], // Brown Oversized Teddy
    ["mixi-1601557226882", 2], // Hugging Teddy Bear
    ["mixi-1601536245463", 2], // Large Capybara Plush
    ["mixi-1601662268776", 2], // Butterfly-Bow Teddy Bear
    ["mixi-1601402734988", 2], // Panda & Unicorn Seat
    ["mixi-1601984481652", 1], // Long Fox Pillow
    ["mixi-1601965390528", 1], // Long Cat Body Pillow
    ["mixi-1601965331197", 1], // Bear Headboard Pillow
    ["mixi-1601965296351", 1], // Dachshund Body Pillow
    ["mixi-1601962844388", 1], // Long Dinosaur Pillow
    ["mixi-1601962410000", 1], // Calico Cat Pillow
    ["mixi-whale-pillow", 1], // Whale Pillow
  ]);
  products.forEach((product) => {
    const curatedRank = sizeRankById.get(product.id);
    product.sizeRank = curatedRank ?? product.sizeRank ?? 0;
    const collections = new Set(product.collections || []);
    if (product.sizeRank >= 1) collections.add("giant");
    product.collections = [...collections];
  });

  function productSizesFor(product) {
    return Array.isArray(product.sizes) && product.sizes.length ? product.sizes : productSizes;
  }

  function productSizeHeight(product, size) {
    const productHeights = product.sizeHeights || {};
    return productHeights[size] || productSizeHeights[size] || size;
  }

  function productPrice(product, size) {
    const sizes = productSizesFor(product);
    if (!sizes.includes(size)) throw new RangeError(`Unknown product size: ${size}.`);
    if (product.prices && typeof product.prices[size] === "number") return product.prices[size];
    if (typeof product.price === "number") return product.price;
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

  function productCardImage(product) {
    const cardImages = window.LittleWonderCardImages || {};
    return cardImages[product.id] || product.image;
  }

  function productThumbImage(product) {
    const cardImages = window.LittleWonderCardImages || {};
    if (cardImages[product.id]) {
      return `assets/products/thumbs/${product.id}-main.webp?v=2`;
    }
    return productCardImage(product);
  }

  function productVisual(product, loading = "lazy", size = "full", image) {
    const source = image || (size === "thumbnail" ? productThumbImage(product) : productCardImage(product));
    const widths = size === "card" ? [480, 720, 960] : size === "thumbnail" ? [240, 360, 480] : [];
    const responsiveAttributes = widths.length && productImageVariant(source, widths[0]) !== source
      ? ` srcset="${widths.map((width) => `${productImageVariant(source, width)} ${width}w`).join(", ")}" sizes="${size === "card" ? "(max-width: 600px) 46vw, (max-width: 900px) 30vw, 22vw" : "120px"}"`
      : "";
    const dimensions = size === "full" && image
      ? ` width="900" height="900"`
      : size === "thumbnail"
        ? ` width="240" height="240"`
        : ` width="480" height="480"`;
    return `<img class="product-image" src="${source}"${responsiveAttributes}${dimensions} alt="${product.name}" loading="${loading}" decoding="async">`;
  }

  function galleryThumbnail(image) {
    if (typeof image === "string" && image.startsWith("assets/products/gallery/")) {
      return `${image.replace("assets/products/gallery/", "assets/products/thumbs/")}?v=1`;
    }
    return productImageVariant(image, 480);
  }

  function productImages(product) {
    const catalogGallery = window.LittleWonderCatalogGallery || {};
    const gallery = catalogGallery[product.id];
    if (Array.isArray(gallery) && gallery.length) return gallery;
    return [product.image, ...(additionalProductImages[product.id] || [])]
      .filter((image, index, list) => list.indexOf(image) === index);
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
      ).map((item) => {
        const product = products.find((entry) => entry.id === item.id);
        const availableSizes = productSizesFor(product);
        const fallbackSize = availableSizes.includes("Medium") ? "Medium" : availableSizes[0];
        return {
          ...item,
          size: availableSizes.includes(item.size) ? item.size : fallbackSize,
        };
      });
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
    productSizesFor,
    productSizePriceRanges,
    productSizeHeights,
    productSizeHeight,
    productPrice,
    storageKey: "little-wonder-cart",
    formatCurrency,
    productVisual,
    productCardImage,
    productThumbImage,
    productImageVariant,
    productImages,
    galleryThumbnail,
    readCart,
    saveCart,
  };
})();
