// ============================================================
// بيانات منيو مطبخ حلويات حلا (39 صنفاً في 8 أقسام)
// ============================================================

const cats = [
  'الكل',
  'كب كيك',
  'البراونيز',
  'أمريكان كوكيز',
  'كب السعادة',
  'المخبوزات',
  'إنجلش كيك (14 قطعة)',
  'قشطوطة',
  'السينابون'
];
const dietTags = [
  { id: 'all', label: '✨ كل الأصناف' },
  { id: 'high-fiber', label: '🌾 بالحبة الكاملة' },
  { id: 'regular', label: '🧁 دقيق عادي / كلاسيك' },
  { id: 'with-sauce', label: '🍫 بصوص من اختيارك' },
  { id: 'lunchbox', label: '🎒 للانش بوكس والمخبوزات' },
  { id: 'no-sugar', label: '🍯 صحي ومشبع' }
];

const SAUCES_LIST = [
  'صوص شوكولاتة غني',
  'صوص نوتيلا بالبندق',
  'صوص كيندر كريمي',
  'صوص كراميل ذهبي',
  'صوص لوتس',
  'صوص فراولة طبيعي',
  'صوص فستق (بيستاشيو)'
];

const FLAVORS_LIST = [
  'شوكولاتة',
  'فانيليا',
  'مشكل (شوكولاتة وفانيليا)'
];

const PRODUCT_IMAGES = {
  cupcake: 'images/cupcake.jpg',
  brownie: 'images/brownie.jpg',
  cookie: 'images/cookie.jpg',
  cup: 'images/cup_saada.jpg',
  bakery: 'images/bakery_qarqeesh.jpg',
  pizza: 'images/pizza.jpg',
  english: 'images/english_cake.jpg',
  qashtouta: 'images/qashtouta.jpg',
  cinnabon: 'images/cinnabon.jpg'
};

const DEFAULT_PRODUCTS = [
  // 1. كب كيك (c: 1)
  {
    id: 1, c: 1, n: 'بوكس كب كيك شوكولاتة أو فانيليا سادة (5 قطع – دقيق عادي)',
    d: 'بوكس مكون من 5 قطع كب كيك بيتي خفيف وهش (شوكولاتة أو فانيليا سادة) مخبوز بالدقيق العادي.',
    p: 80, cal: 150, unit: 'للقطعة', badge: '🧁 5 قطع • دقيق عادي', inStock: true,
    hasFlavor: true, hasSauce: false,
    tags: ['regular', 'lunchbox'],
    ingredients: 'دقيق فاخر، بيض طازج، حليب، زبدة طبيعية، فانيليا أو كاكاو خام.',
    img: PRODUCT_IMAGES.cupcake
  },
  {
    id: 2, c: 1, n: 'بوكس كب كيك شوكولاتة أو فانيليا بصوص من اختيارك (5 قطع – دقيق عادي)',
    d: 'بوكس 5 قطع كب كيك شوكولاتة أو فانيليا بالدقيق العادي مغطى بصوص غني من اختيارك.',
    p: 100, cal: 185, unit: 'للقطعة', badge: '🍫 5 قطع بصوص • دقيق عادي', inStock: true,
    hasFlavor: true, hasSauce: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'دقيق فاخر، بيض، حليب، فانيليا أو كاكاو، مع صوص فاخر حسب اختيارك.',
    img: PRODUCT_IMAGES.cupcake
  },
  {
    id: 3, c: 1, n: 'بوكس كب كيك شوكولاتة أو فانيليا (5 قطع – حبة كاملة)',
    d: 'بوكس صحي 5 قطع كب كيك شوكولاتة أو فانيليا مخبوز بدقيق القمح الكامل 100% المشبع والغني بالألياف.',
    p: 100, cal: 120, unit: 'للقطعة', badge: '🌾 5 قطع • حبة كاملة', inStock: true,
    hasFlavor: true, hasSauce: false,
    tags: ['high-fiber', 'no-sugar', 'lunchbox'],
    ingredients: 'دقيق قمح كامل 100%، زبادي، بيض بلدي، فانيليا أو كاكاو خام، تحلية طبيعية.',
    img: PRODUCT_IMAGES.cupcake
  },
  {
    id: 4, c: 1, n: 'بوكس كب كيك شوكولاتة أو فانيليا بصوص من اختيارك (5 قطع – حبة كاملة)',
    d: 'بوكس 5 قطع كب كيك بالحبة الكاملة (شوكولاتة أو فانيليا) مزين بصوص من اختيارك ليجمع بين الفائدة الصحية والطعم الغني.',
    p: 120, cal: 145, unit: 'للقطعة', badge: '🌾 حبة كاملة + صوص', inStock: true,
    hasFlavor: true, hasSauce: true,
    tags: ['high-fiber', 'with-sauce', 'no-sugar'],
    ingredients: 'دقيق قمح كامل 100%، كاكاو خام أو فانيليا، بيض، حليب، وصوص من اختيارك.',
    img: PRODUCT_IMAGES.cupcake
  },
  {
    id: 5, c: 1, n: 'كب كيك سادة',
    d: 'قطعة كب كيك فردية هشة وطازجة (شوكولاتة أو فانيليا سادة) مثالية مع الشاي أو القهوة أو للانش بوكس.',
    p: 20, cal: 135, unit: 'للقطعة', badge: '🧁 قطعة فردية سادة', inStock: true,
    hasFlavor: true, hasSauce: false,
    tags: ['regular', 'lunchbox'],
    ingredients: 'دقيق، بيض طازج، حليب، زبدة، فانيليا أو شوكولاتة.',
    img: PRODUCT_IMAGES.cupcake
  },
  {
    id: 6, c: 1, n: 'كب كيك شوكولاتة أو فانيليا بصوص من اختيارك',
    d: 'قطعة كب كيك فردية (شوكولاتة أو فانيليا) مغطاة بصوص لذيذ من اختيارك.',
    p: 25, cal: 165, unit: 'للقطعة', badge: '🍫 قطعة بصوص من اختيارك', inStock: true,
    hasFlavor: true, hasSauce: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'كب كيك طازج شوكولاتة أو فانيليا مع توبينج صوص من اختيارك.',
    img: PRODUCT_IMAGES.cupcake
  },

  // 2. البراونيز (c: 2)
  {
    id: 7, c: 2, n: 'بوكس 6 براونيز سادة',
    d: 'بوكس يضم 6 قطع براونيز غنية وطرية (Fudgy) محضرة بالكاكاو الفاخر والشوكولاتة الحقيقية.',
    p: 120, cal: 145, unit: 'للقطعة', badge: '🍫 بوكس 6 قطع سادة', inStock: true,
    hasFlavor: false, hasSauce: false,
    tags: ['regular', 'lunchbox'],
    ingredients: 'شوكولاتة غنية، كاكاو خام، زبدة طبيعية، بيض، دقيق.',
    img: PRODUCT_IMAGES.brownie
  },
  {
    id: 8, c: 2, n: 'بوكس 6 براونيز بصوص من اختيارك',
    d: 'بوكس 6 قطع براونيز فادجي غرقان بصوص من اختيارك (نوتيلا، شوكولاتة، كيندر، كراميل، أو لوتس).',
    p: 150, cal: 180, unit: 'للقطعة', badge: '🍫 6 قطع بصوص من اختيارك', inStock: true,
    hasFlavor: false, hasSauce: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'براونيز شوكولاتة غني مغطى بطبقة وفيرة من الصوص المفضل لديك.',
    img: PRODUCT_IMAGES.brownie
  },
  {
    id: 9, c: 2, n: 'قطعة براونيز بصوص من اختيارك',
    d: 'قطعة براونيز غنية وطرية تقدم مع صوص من اختيارك لتحلية سريعة ولا تقاوم.',
    p: 30, cal: 180, unit: 'للقطعة', badge: '✨ قطعة بصوص من اختيارك', inStock: true,
    hasFlavor: false, hasSauce: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'براونيز شوكولاتة فادجي طازج + صوص من اختيارك.',
    img: PRODUCT_IMAGES.brownie
  },

  // 3. أمريكان كوكيز (c: 3)
  {
    id: 10, c: 3, n: 'بوكس 6 كوكيز شوكولاتة',
    d: 'بوكس 6 قطع أمريكان كوكيز أصلي مقرمش من الأطراف وطري وغني بقطع الشوكولاتة من الداخل.',
    p: 120, cal: 140, unit: 'للقطعة', badge: '🍪 بوكس 6 قطع شوكولاتة', inStock: true,
    hasFlavor: false, hasSauce: false,
    tags: ['regular', 'lunchbox'],
    ingredients: 'زبدة طبيعية، شوكليت شيبس، سكر بني، دقيق، بيض، فانيليا.',
    img: PRODUCT_IMAGES.cookie
  },
  {
    id: 11, c: 3, n: 'بوكس 6 كوكيز بصوص من اختيارك',
    d: 'بوكس 6 قطع أمريكان كوكيز طازج مزين بصوص غني من اختيارك (نوتيلا، كيندر، شوكولاتة، كراميل، أو لوتس).',
    p: 150, cal: 175, unit: 'للقطعة', badge: '🍫 6 كوكيز بصوص من اختيارك', inStock: true,
    hasFlavor: false, hasSauce: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'أمريكان كوكيز بقطع الشوكولاتة مع توبينج صوص من اختيارك.',
    img: PRODUCT_IMAGES.cookie
  },
  {
    id: 12, c: 3, n: 'قطعة أمريكان كوكيز كبيرة',
    d: 'قطعة أمريكان كوكيز جامبو غنية بقطع الشوكولاتة الذائبة، مخبوزة طازجة لطلبك.',
    p: 30, cal: 190, unit: 'للقطعة الكبيرة', badge: '🍪 قطعة أمريكان كبيرة', inStock: true,
    hasFlavor: false, hasSauce: false,
    tags: ['regular', 'lunchbox'],
    ingredients: 'عجينة أمريكان كوكيز غنية بالزبدة وقطع الشوكولاتة الفاخرة.',
    img: PRODUCT_IMAGES.cookie
  },

  // 4. كب السعادة (كل الأنواع 40) (c: 4)
  {
    id: 13, c: 4, n: 'كب السعادة - أوريو',
    d: 'طبقات غنية من الكيك والكريمة الناعمة وقطع بسكويت الأوريو المقرمش وصوص الشوكولاتة.',
    p: 40, cal: 240, unit: 'للكب', badge: '🍨 كب السعادة • 40 ج.م', inStock: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'كيك طري، كريمة مخفوقة، بسكويت أوريو، جناش شوكولاتة.',
    img: PRODUCT_IMAGES.cup
  },
  {
    id: 14, c: 4, n: 'كب السعادة - شوكولاتة',
    d: 'كب غرقان في طبقات كيك الشوكولاتة وموس الشوكولاتة الغني وصوص الجناش الفاخر.',
    p: 40, cal: 250, unit: 'للكب', badge: '🍫 كب السعادة • 40 ج.م', inStock: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'كيك شوكولاتة، كريمة شوكولاتة، صوص شوكولاتة غني.',
    img: PRODUCT_IMAGES.cup
  },
  {
    id: 15, c: 4, n: 'كب السعادة - كيندر',
    d: 'طبقات السعادة بطعم شوكولاتة كيندر البندق الكريمية الساحرة مع الكيك الهش.',
    p: 40, cal: 260, unit: 'للكب', badge: '🍫 كب السعادة • 40 ج.م', inStock: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'كيك، كريمة بندق بيضاء، صوص وقطع كيندر.',
    img: PRODUCT_IMAGES.cup
  },
  {
    id: 16, c: 4, n: 'كب السعادة - نوتيلا',
    d: 'كب غني بطبقات الكيك والكريمة المغطاة بشوكولاتة نوتيلا الأصلية بالبندق.',
    p: 40, cal: 265, unit: 'للكب', badge: '🌰 كب السعادة • 40 ج.م', inStock: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'كيك شوكولاتة وفانيليا، كريمة، نوتيلا غنية بالبندق.',
    img: PRODUCT_IMAGES.cup
  },
  {
    id: 17, c: 4, n: 'كب السعادة - كاسترد',
    d: 'طبقات الكيك الهش مع الكاسترد البيتي الكريمي الناعم بطعم الفانيليا الأصلي.',
    p: 40, cal: 210, unit: 'للكب', badge: '🍮 كب السعادة • 40 ج.م', inStock: true,
    tags: ['regular'],
    ingredients: 'كيك فانيليا، كاسترد بالحليب الطازج والفانيليا، طبقة كريمة.',
    img: PRODUCT_IMAGES.cup
  },
  {
    id: 18, c: 4, n: 'كب السعادة - كراميل',
    d: 'مزيج رائع من الكيك الهش والكريمة الغنية وصوص الكراميل الذهبي البيتي.',
    p: 40, cal: 235, unit: 'للكب', badge: '🍯 كب السعادة • 40 ج.م', inStock: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'كيك فانيليا، كريمة مخفوقة، صوص كراميل طبيعي.',
    img: PRODUCT_IMAGES.cup
  },

  // 5. المخبوزات (c: 5)
  {
    id: 19, c: 5, n: 'نصف كيلو قراقيش سادة (دقيق عادي)',
    d: 'نصف كيلو قراقيش بيتي مقرمشة وهشة بالدقيق العادي والسمسم المحمص، مثالية مع الشاي واللبن.',
    p: 100, cal: 110, unit: 'للقطعة', badge: '🥖 دقيق عادي • ½ كيلو', inStock: true,
    tags: ['regular', 'lunchbox'],
    ingredients: 'دقيق فاخر، سمن طبيعي، سمسم محمص، شمر وينسون اختياري، خميرة.',
    img: PRODUCT_IMAGES.bakery
  },
  {
    id: 20, c: 5, n: 'نصف كيلو قراقيش عجوة (دقيق عادي)',
    d: 'نصف كيلو قراقيش بيتي ذهبية بالدقيق العادي محشوة بالعجوة الطرية الطبيعية والسمسم.',
    p: 130, cal: 135, unit: 'للقطعة', badge: '🌴 بالعجوة • دقيق عادي', inStock: true,
    tags: ['regular', 'lunchbox'],
    ingredients: 'دقيق فاخر، عجوة بلدي طرية، سمن، سمسم محمص.',
    img: PRODUCT_IMAGES.bakery
  },
  {
    id: 21, c: 5, n: 'نصف كيلو قراقيش سادة (حبة كاملة)',
    d: 'نصف كيلو قراقيش صحية مشبعة مخبوزة بدقيق القمح الكامل 100% والسمسم، غنية بالألياف.',
    p: 120, cal: 90, unit: 'للقطعة', badge: '🌾 حبة كاملة • ½ كيلو', inStock: true,
    tags: ['high-fiber', 'no-sugar', 'lunchbox'],
    ingredients: 'دقيق قمح كامل بالحبة الكاملة 100%، زيت زيتون وسمن طبيعي خفيف، سمسم، شمر وينسون.',
    img: PRODUCT_IMAGES.bakery
  },
  {
    id: 22, c: 5, n: 'نصف كيلو قراقيش عجوة (حبة كاملة)',
    d: 'نصف كيلو قراقيش بالحبة الكاملة محشوة بتمر العجوة الطبيعي لطاقة صحية وشبع طويل.',
    p: 150, cal: 115, unit: 'للقطعة', badge: '🌾 حبة كاملة بالعجوة', inStock: true,
    tags: ['high-fiber', 'no-sugar', 'lunchbox'],
    ingredients: 'دقيق قمح كامل 100%، عجوة تمر طبيعية، سمسم محمص.',
    img: PRODUCT_IMAGES.bakery
  },
  {
    id: 23, c: 5, n: 'نصف كيلو بيتزا (عادية)',
    d: 'نصف كيلو ميني بيتزا بيتي هشة بالدقيق العادي مع صلصة البيتزا الغنية والجبن الموتزاريلا والخضار.',
    p: 120, cal: 120, unit: 'للقطعة', badge: '🍕 بيتزا عادية • ½ كيلو', inStock: true,
    tags: ['regular', 'lunchbox'],
    ingredients: 'دقيق فاخر، صلصة طماطم بالزعتر والريحان، جبن موتزاريلا، زيتون وفلفل ألوان.',
    img: PRODUCT_IMAGES.pizza
  },
  {
    id: 24, c: 5, n: 'نصف كيلو بيتزا (حبة كاملة)',
    d: 'نصف كيلو ميني بيتزا صحية مخبوزة بدقيق الحبة الكاملة 100% والموتزاريلا الطبيعي والزيتون والفلفل.',
    p: 150, cal: 95, unit: 'للقطعة', badge: '🌾 بيتزا حبة كاملة • ½ كيلو', inStock: true,
    tags: ['high-fiber', 'no-sugar', 'lunchbox'],
    ingredients: 'دقيق قمح كامل 100%، زيت زيتون، صلصة طماطم طبيعية، موتزاريلا، زيتون وفلفل.',
    img: PRODUCT_IMAGES.pizza
  },
  {
    id: 25, c: 5, n: 'نصف كيلو باتية (عادية)',
    d: 'نصف كيلو باتيه بيتي مورق وخفيف بالدقيق العادي محشو بالجبنة الغنية، رائع للفطار واللانش بوكس.',
    p: 120, cal: 130, unit: 'للقطعة', badge: '🥐 باتيه عادي • ½ كيلو', inStock: true,
    tags: ['regular', 'lunchbox'],
    ingredients: 'دقيق فاخر، زبدة طبيعية، حليب، حشوة جبنة غنية.',
    img: PRODUCT_IMAGES.bakery
  },
  {
    id: 26, c: 5, n: 'نصف كيلو باتية (حبة كاملة)',
    d: 'نصف كيلو باتيه صحي ومشبع بدقيق القمح الكامل 100% بحشوة الجبنة الطبيعية.',
    p: 150, cal: 105, unit: 'للقطعة', badge: '🌾 باتيه حبة كاملة • ½ كيلو', inStock: true,
    tags: ['high-fiber', 'no-sugar', 'lunchbox'],
    ingredients: 'دقيق قمح كامل 100%، حليب، زيت زيتون وزبدة خفيفة، حشوة جبنة.',
    img: PRODUCT_IMAGES.bakery
  },
  {
    id: 27, c: 5, n: 'نصف كيلو مخبوزات مشكلة (عادية)',
    d: 'تشكيلة نصف كيلو مخبوزات بيتي متنوعة (بيتزا + باتيه + قراقيش) بالدقيق العادي ترضي كل الأذواق.',
    p: 150, cal: 125, unit: 'للقطعة', badge: '🧺 مشكل عادي • ½ كيلو', inStock: true,
    tags: ['regular', 'lunchbox'],
    ingredients: 'تشكيلة طازجة من البيتزا والباتيه والقراقيش بالدقيق الفاخر.',
    img: PRODUCT_IMAGES.bakery
  },
  {
    id: 28, c: 5, n: 'نصف كيلو مخبوزات مشكلة (حبة كاملة)',
    d: 'تشكيلة نصف كيلو مخبوزات صحية متنوعة (بيتزا + باتيه + قراقيش) مصنوعة بالكامل بدقيق الحبة الكاملة.',
    p: 200, cal: 100, unit: 'للقطعة', badge: '🌾 مشكل حبة كاملة • ½ كيلو', inStock: true,
    tags: ['high-fiber', 'no-sugar', 'lunchbox'],
    ingredients: 'تشكيلة صحية 100% بالحبة الكاملة من البيتزا والباتيه والقراقيش.',
    img: PRODUCT_IMAGES.bakery
  },

  // 6. إنجلش كيك (14 قطعة) (c: 6)
  {
    id: 29, c: 6, n: 'قالب إنجلش كيك فانيليا',
    d: 'قالب إنجلش كيك فانيليا بيتي هش وغني (14 قطعة جاهزة للتقديم) مثالي للفطار والضيافة.',
    p: 120, cal: 115, unit: 'للقطعة (14 قطعة)', badge: '🍰 14 قطعة • فانيليا', inStock: true,
    tags: ['regular', 'lunchbox'],
    ingredients: 'دقيق، بيض طازج، زبدة، حليب، فانيليا طبيعية.',
    img: PRODUCT_IMAGES.english
  },
  {
    id: 30, c: 6, n: 'قالب إنجلش كيك شوكولاتة',
    d: 'قالب إنجلش كيك شوكولاتة غني بالكاكاو الفاخر (14 قطعة) بطعم بيتي يذوب في الفم.',
    p: 140, cal: 125, unit: 'للقطعة (14 قطعة)', badge: '🍫 14 قطعة • شوكولاتة', inStock: true,
    tags: ['regular', 'lunchbox'],
    ingredients: 'دقيق، كاكاو خام فاخر، شوكولاتة، بيض، حليب، زبدة.',
    img: PRODUCT_IMAGES.english
  },
  {
    id: 31, c: 6, n: 'قالب إنجلش كيك برتقال',
    d: 'قالب إنجلش كيك منعش بعصير وبشر البرتقال الطبيعي الفريش (14 قطعة).',
    p: 130, cal: 120, unit: 'للقطعة (14 قطعة)', badge: '🍊 14 قطعة • برتقال', inStock: true,
    tags: ['regular', 'lunchbox'],
    ingredients: 'دقيق، عصير وبشر برتقال طبيعي، بيض، زبدة، فانيليا.',
    img: PRODUCT_IMAGES.english
  },
  {
    id: 32, c: 6, n: 'قالب إنجلش كيك شوكولاتة وفانيليا (حبة كاملة)',
    d: 'قالب إنجلش كيك ماربل (شوكولاتة وفانيليا) صحي ومشبع مخبوز بدقيق الحبة الكاملة (14 قطعة).',
    p: 150, cal: 95, unit: 'للقطعة (14 قطعة)', badge: '🌾 حبة كاملة • 14 قطعة', inStock: true,
    tags: ['high-fiber', 'no-sugar', 'lunchbox'],
    ingredients: 'دقيق قمح كامل 100%، كاكاو خام، فانيليا طبيعية، بيض، حليب.',
    img: PRODUCT_IMAGES.english
  },

  // 7. قشطوطة (كل الأنواع 40) (c: 7)
  {
    id: 33, c: 7, n: 'قشطوطة - سادة',
    d: 'كيكة الحليب والقشطة الغنية المسقية باللبن والكريمة الطازجة بطعم بيتي كريمي أصلي.',
    p: 40, cal: 220, unit: 'للعلبة', badge: '🥛 قشطوطة • 40 ج.م', inStock: true,
    tags: ['regular'],
    ingredients: 'كيك إسفنجي طري، حليب ثلاثي غني، طبقة قشطة وكريمة طازجة.',
    img: PRODUCT_IMAGES.qashtouta
  },
  {
    id: 34, c: 7, n: 'قشطوطة - فراولة',
    d: 'قشطوطة غرقانة في الحليب والقشطة ومزينة بصوص وقطع الفراولة الطبيعية المنعشة.',
    p: 40, cal: 235, unit: 'للعلبة', badge: '🍓 قشطوطة • 40 ج.م', inStock: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'كيك الحليب، قشطة وكريمة، صوص وقطع فراولة طازجة.',
    img: PRODUCT_IMAGES.qashtouta
  },
  {
    id: 35, c: 7, n: 'قشطوطة - مانجو',
    d: 'قشطوطة بالحليب والقشطة مغطاة بقطع المانجو الفريش وصوص المانجو الطبيعي.',
    p: 40, cal: 245, unit: 'للعلبة', badge: '🥭 قشطوطة • 40 ج.م', inStock: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'كيك الحليب، قشطة وكريمة، قطع وصوص مانجو طبيعي.',
    img: PRODUCT_IMAGES.qashtouta
  },
  {
    id: 36, c: 7, n: 'قشطوطة - شوكولاتة',
    d: 'قشطوطة كريمية مسقية بالحليب مع طبقة غنية من صوص الشوكولاتة الفاخرة.',
    p: 40, cal: 260, unit: 'للعلبة', badge: '🍫 قشطوطة • 40 ج.م', inStock: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'كيك الحليب، قشطة وكريمة، جناش شوكولاتة غني.',
    img: PRODUCT_IMAGES.qashtouta
  },
  {
    id: 37, c: 7, n: 'قشطوطة - كراميل',
    d: 'قشطوطة بالحليب والقشطة مع طبقة كراميل ذهبي بيتي غني ومميز.',
    p: 40, cal: 250, unit: 'للعلبة', badge: '🍯 قشطوطة • 40 ج.م', inStock: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'كيك الحليب، قشطة وكريمة، صوص كراميل طبيعي.',
    img: PRODUCT_IMAGES.qashtouta
  },

  // 8. السينابون (c: 8)
  {
    id: 38, c: 8, n: 'بوكس سينابون غرقان صوص ومكسرات (4 قطع)',
    d: 'أقوى سينابون بيتي طري وهش بالقرفة الفاخرة، غرقان بصوص الجبنة الكريمي والصوص المفضل والمكسرات المحمصة.',
    p: 140, cal: 260, unit: 'للقطعة', badge: 'innamon 🌀 غرقان صوص ومكسرات'.replace('innamon ', ''), inStock: true,
    hasFlavor: false, hasSauce: true,
    tags: ['regular', 'with-sauce'],
    ingredients: 'عجينة سينابون بيتي هشة، قرفة سيلاني، صوص جبنة كريمي، شوكولاتة أو كراميل، ومكسرات محمصة.',
    img: PRODUCT_IMAGES.cinnabon
  },
  {
    id: 39, c: 8, n: 'بوكس سينابون بالحبة الكاملة وصوص ومكسرات (4 قطع)',
    d: 'رولز سينابون صحية بدقيق الحبة الكاملة والقرفة الطبيعية مع صوص الجبنة الكريمي والمكسرات.',
    p: 160, cal: 210, unit: 'للقطعة', badge: '🌾 حبة كاملة • سينابون', inStock: true,
    hasFlavor: false, hasSauce: true,
    tags: ['high-fiber', 'with-sauce', 'no-sugar'],
    ingredients: 'دقيق قمح كامل 100%، قرفة طبيعية، صوص كريمي خفيف، مكسرات محمصة.',
    img: PRODUCT_IMAGES.cinnabon
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'HL-7821', date: '2026-10-29 18:30',
    customer: 'أحمد محمود', phone: '01012345678', wa: '01012345678',
    address: 'سموحة، شارع فوزي معاذ، عمارة 14، دور 5',
    items: [{ id: 4, q: 1, opt: 'شوكولاتة • صوص نوتيلا بالبندق' }, { id: 24, q: 1 }],
    sweetener: 'عسل نحل طبيعي',
    payment: 'محفظة إلكترونية (فودافون كاش)',
    subtotal: 270, delivery: 30, total: 300,
    status: 'تم التسليم بنجاح', notes: 'التوصيل بعد العصر'
  },
  {
    id: 'HL-7822', date: '2026-10-29 20:15',
    customer: 'ريهام سمير', phone: '01298765432', wa: '01298765432',
    address: 'سيدي جابر، شارع المشير، عمارة 7، شقة 12',
    items: [{ id: 8, q: 1, opt: 'صوص كيندر كريمي' }, { id: 15, q: 2 }],
    sweetener: 'سكر ستيفيا (زيرو كالوري)',
    payment: 'محفظة إلكترونية (فودافون كاش)',
    subtotal: 230, delivery: 30, total: 260,
    status: 'جاري التجهيز', notes: 'بوكس البراونيز بصوص كيندر'
  },
  {
    id: 'HL-7823', date: '2026-10-29 21:40',
    customer: 'كريم عادل', phone: '01123456789', wa: '01123456789',
    address: 'لوران، شارع الإقبال، برج الصفا، شقة 4',
    items: [{ id: 32, q: 1 }, { id: 35, q: 2 }],
    sweetener: 'عسل نحل طبيعي',
    payment: 'الدفع عند الاستلام (كاش)',
    subtotal: 230, delivery: 30, total: 260,
    status: 'جديد', notes: 'اتصال قبل الوصول'
  }
];

// Track per-product selected flavor/sauce options in memory
const selectedOptions = {};
function getProductOptionText(id) {
  const p = DEFAULT_PRODUCTS.find(x => x.id === id) || {};
  const parts = [];
  if (p.hasFlavor) {
    const flEl = document.getElementById('flav-' + id);
    parts.push('النكهة: ' + (flEl ? flEl.value : (selectedOptions['f_' + id] || FLAVORS_LIST[0])));
  }
  if (p.hasSauce) {
    const scEl = document.getElementById('sauce-' + id);
    parts.push('الصوص: ' + (scEl ? scEl.value : (selectedOptions['s_' + id] || SAUCES_LIST[0])));
  }
  return parts.join(' | ');
}

const DEFAULT_REVIEWS = [
  { id: 1, name: 'سارة م.', phone: '010****123', rating: 5, comment: 'الميني بيتزا بالحبة الكاملة تحفة وخفيفة جداً، والأولاد عجبتهم جداً في اللانش بوكس!', date: 'منذ يومين' },
  { id: 2, name: 'أحمد ك.', phone: '012****889', rating: 5, comment: 'بوكس البراونيز الدارك والكوكيز طعمهم فاخر ومش مسكر زيادة.. أحلى سناك صحي مع القهوة.', date: 'منذ 3 أيام' },
  { id: 3, name: 'د. نهى ع.', phone: '011****445', rating: 5, comment: 'ممتازين بجد، أول مرة ألاقي مخبوزات حبة كاملة متقنة وطازجة بدون دقيق أبيض.', date: 'منذ 5 أيام' }
];
