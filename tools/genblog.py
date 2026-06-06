import html, json
SITE="https://www.mgcoat.com"; WA="https://wa.me/905528767973"; DATE="2026-06-04"
FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Vazirmatn:wght@400;500;600;700&display=swap"/>'
LANGS=["en","ru","tr","ar","fa"]; RTL={"ar","fa"}
LBL={"en":("🇬🇧","English"),"ru":("🇷🇺","Русский"),"tr":("🇹🇷","Türkçe"),"ar":("🇸🇦","العربية"),"fa":("🇮🇷","فارسی")}
BACK={"en":"Back to site","ru":"На сайт","tr":"Siteye dön","ar":"العودة للموقع","fa":"بازگشت به سایت"}
HOME={"en":"Home","ru":"Главная","tr":"Ana sayfa","ar":"الرئيسية","fa":"خانه"}
BLOGW={"en":"Blog","ru":"Блог","tr":"Blog","ar":"المدونة","fa":"بلاگ"}
CTA={"en":"Get a quote on WhatsApp","ru":"Запросить цену в WhatsApp","tr":"WhatsApp'tan teklif al","ar":"احصل على عرض سعر عبر واتساب","fa":"دریافت قیمت در واتساپ"}
MORE={"en":"More articles","ru":"Другие статьи","tr":"Diğer yazılar","ar":"مقالات أخرى","fa":"مقاله‌های بیشتر"}
READ={"en":"Read article","ru":"Читать","tr":"Oku","ar":"اقرأ المقال","fa":"خواندن مقاله"}
BLOGTITLE={"en":"Blog & Insights","ru":"Блог и статьи","tr":"Blog ve İçgörüler","ar":"المدونة والمقالات","fa":"بلاگ و مقالات"}
BLOGLEAD={"en":"Practical guides on PCB waterproofing, protective coatings and protecting electronics in harsh environments.",
"ru":"Практические руководства по гидроизоляции плат, защитным покрытиям и защите электроники в тяжёлых условиях.",
"tr":"PCB su yalıtımı, koruyucu kaplamalar ve elektroniğin zorlu ortamlarda korunması üzerine pratik rehberler.",
"ar":"أدلة عملية حول عزل لوحات PCB والطلاءات الواقية وحماية الإلكترونيات في البيئات القاسية.",
"fa":"راهنماهای کاربردی دربارهٔ ضدآب‌سازی بردهای PCB، پوشش‌های محافظ و محافظت از الکترونیک در شرایط سخت."}

# ---------------- article content (5 languages) ----------------
A1={ "slug":"how-to-waterproof-a-pcb","kw":"waterproof PCB, PCB waterproofing, protective coating",
"L":{
"en":{"title":"How to Waterproof a PCB: Methods and Best Practices",
"desc":"A practical guide to waterproofing printed circuit boards: cleaning, masking, coating methods (dipping, spraying, brushing), curing and testing.",
"intro":"Moisture, humidity, condensation, salt and washing are common causes of electronic failure. Coating a PCB is one of the most cost-effective ways to extend its life in harsh or outdoor environments. Here are the practical steps.",
"secs":[("Clean and dry the board","Remove flux residue, dust and oils with isopropyl alcohol and let the board dry fully. Trapped moisture or contamination under a coating reduces adhesion and protection."),
("Mask functional areas","Connectors, switches, moving contacts, heat-dissipation surfaces and calibration points should be masked before coating so they stay accessible."),
("Choose an application method","Dipping suits full coverage, spraying gives even layers, and brushing is ideal for local reinforcement of edges, cable entries and repair zones. Liquid PCB Plastic Coating supports all three."),
("Cure and test","Let the coating cure fully, then verify with a controlled water test on a powered low-voltage board and a simple scratch test. For immersion, the whole assembly must be sealed with no trapped air.")],
"close":"Liquid PCB Plastic Coating by MG TECH is a heat-free, plastic-based nano coating made for waterproofing PCBs, sensors and electronic circuits with mechanical reinforcement."},
"fa":{"title":"چطور یک برد PCB را ضدآب کنیم: روش‌ها و نکات کلیدی",
"desc":"راهنمای کاربردی ضدآب‌کردن بردهای PCB: تمیزکاری، ماسک‌کاری، روش‌های پوشش (غوطه‌وری، اسپری، قلم‌مو)، خشک‌شدن و تست.",
"intro":"رطوبت، بخار، میعان، نمک و شست‌وشو از دلایل رایج خرابی الکترونیک‌اند. پوشش‌دادن برد یکی از مقرون‌به‌صرفه‌ترین راه‌ها برای افزایش عمر آن در شرایط سخت یا فضای باز است. مراحل عملی:",
"secs":[("تمیز و خشک کردن برد","با الکل ایزوپروپیل، باقی‌ماندهٔ فلاکس، گردوغبار و چربی را پاک کنید و بگذارید برد کاملاً خشک شود. رطوبت یا آلودگیِ گیرافتاده زیر پوشش، چسبندگی و محافظت را کم می‌کند."),
("ماسک‌کردن بخش‌های عملکردی","کانکتورها، کلیدها، کنتاکت‌های متحرک، سطوح دفع حرارت و نقاط کالیبراسیون باید قبل از پوشش ماسک شوند تا در دسترس بمانند."),
("انتخاب روش اجرا","غوطه‌وری برای پوشش کامل، اسپری برای لایهٔ یکنواخت، و قلم‌مو برای تقویت موضعی لبه‌ها، ورودی کابل و نقاط تعمیر مناسب است. Liquid PCB Plastic Coating هر سه را پشتیبانی می‌کند."),
("خشک‌شدن و تست","بگذارید پوشش کاملاً خشک شود، سپس با یک تست آبِ کنترل‌شده روی برد فعال کم‌ولتاژ و یک تست خراش ساده آن را بررسی کنید. برای غوطه‌وری، کل مجموعه باید بدون حباب هوا آب‌بندی شود.")],
"close":"Liquid PCB Plastic Coating محصول MG TECH یک پوشش نانویی بر پایه پلاستیک و بدون حرارت است که برای ضدآب‌کردن بردها، سنسورها و مدارهای الکترونیکی همراه با تقویت مکانیکی ساخته شده است."},
"ru":{"title":"Как сделать плату (PCB) водостойкой: методы и практики",
"desc":"Практическое руководство по гидроизоляции печатных плат: очистка, маскирование, методы нанесения (окунание, распыление, кисть), отверждение и тесты.",
"intro":"Влага, конденсат, соль и мойка — частые причины отказов электроники. Покрытие платы — один из самых экономичных способов продлить её срок службы в тяжёлых или уличных условиях. Практические шаги:",
"secs":[("Очистите и высушите плату","Удалите остатки флюса, пыль и масла изопропиловым спиртом и дайте плате полностью высохнуть. Влага или загрязнение под покрытием снижают адгезию и защиту."),
("Замаскируйте функциональные зоны","Разъёмы, переключатели, подвижные контакты, поверхности теплоотвода и точки калибровки нужно замаскировать до нанесения, чтобы они оставались доступными."),
("Выберите метод нанесения","Окунание — для полного покрытия, распыление — для ровного слоя, кисть — для локального усиления краёв, вводов кабеля и зон ремонта. Liquid PCB Plastic Coating поддерживает все три."),
("Отверждение и тест","Дайте покрытию полностью высохнуть, затем проверьте контролируемым водным тестом на работающей низковольтной плате и простым тестом на царапание. Для погружения весь узел должен быть герметизирован без воздуха.")],
"close":"Liquid PCB Plastic Coating от MG TECH — это нанопокрытие на пластиковой основе без нагрева для гидроизоляции плат, датчиков и электронных схем с механическим усилением."},
"tr":{"title":"Bir PCB Nasıl Su Geçirmez Yapılır: Yöntemler ve İpuçları",
"desc":"Baskılı devre kartlarını su geçirmez yapma rehberi: temizleme, maskeleme, kaplama yöntemleri (daldırma, püskürtme, fırça), kürlenme ve test.",
"intro":"Nem, yoğuşma, tuz ve yıkama elektronik arızalarının yaygın nedenleridir. Bir PCB'yi kaplamak, zorlu veya dış mekân koşullarında ömrünü uzatmanın en uygun maliyetli yollarından biridir. Pratik adımlar:",
"secs":[("Kartı temizleyin ve kurutun","Flux kalıntısını, tozu ve yağları izopropil alkolle temizleyin ve kartın tamamen kurumasını sağlayın. Kaplama altında kalan nem veya kir, yapışmayı ve korumayı azaltır."),
("İşlevsel alanları maskeleyin","Konnektörler, anahtarlar, hareketli kontaklar, ısı dağıtma yüzeyleri ve kalibrasyon noktaları kaplamadan önce maskelenmeli, erişilebilir kalmalıdır."),
("Bir uygulama yöntemi seçin","Daldırma tam kaplama, püskürtme düzgün katman, fırça ise kenarların, kablo girişlerinin ve onarım bölgelerinin yerel güçlendirmesi içindir. Liquid PCB Plastic Coating üçünü de destekler."),
("Kürleme ve test","Kaplamanın tamamen kurumasını bekleyin, ardından çalışan düşük voltajlı bir kartta kontrollü su testi ve basit bir çizik testiyle doğrulayın. Daldırma için tüm montaj hava boşluğu olmadan sızdırmaz olmalıdır.")],
"close":"MG TECH'in Liquid PCB Plastic Coating ürünü; PCB'leri, sensörleri ve elektronik devreleri mekanik güçlendirmeyle su geçirmez yapmak için ısı gerektirmeyen, plastik esaslı bir nano kaplamadır."},
"ar":{"title":"كيف تجعل لوحة PCB مقاومة للماء: الطرق وأفضل الممارسات",
"desc":"دليل عملي لعزل لوحات PCB: التنظيف، التغطية، طرق الطلاء (الغمس، الرش، الفرشاة)، الجفاف والاختبار.",
"intro":"الرطوبة والتكثّف والملح والغسيل من الأسباب الشائعة لتعطّل الإلكترونيات. طلاء اللوحة من أكثر الطرق فعاليةً من حيث التكلفة لإطالة عمرها في البيئات القاسية أو الخارجية. الخطوات العملية:",
"secs":[("نظّف اللوحة وجفّفها","أزل بقايا الفلَكس والغبار والزيوت بكحول الأيزوبروبيل واترك اللوحة تجف تماماً. الرطوبة أو التلوّث تحت الطلاء يقلّلان الالتصاق والحماية."),
("غطِّ المناطق الوظيفية","يجب تغطية الموصلات والمفاتيح والكونتاكتات المتحركة وأسطح تبديد الحرارة ونقاط المعايرة قبل الطلاء لتبقى متاحة."),
("اختر طريقة التطبيق","الغمس للتغطية الكاملة، والرش لطبقة متساوية، والفرشاة للتقوية الموضعية للحواف ومداخل الكابلات ومناطق الإصلاح. يدعم Liquid PCB Plastic Coating الطرق الثلاث."),
("الجفاف والاختبار","اترك الطلاء يجف تماماً، ثم تحقّق باختبار ماء مضبوط على لوحة منخفضة الجهد تعمل واختبار خدش بسيط. للغمر، يجب عزل المجموعة كاملةً دون هواء محبوس.")],
"close":"إن Liquid PCB Plastic Coating من MG TECH طلاء نانوي قائم على البلاستيك وبدون حرارة، مصمّم لعزل لوحات PCB والحساسات والدوائر الإلكترونية مع تقوية ميكانيكية."},
}}

A2={"slug":"conformal-coating-vs-plastic-coating","kw":"conformal coating, PCB protective coating, acrylic coating",
"L":{
"en":{"title":"Conformal Coating vs. Liquid Plastic Protective Coating",
"desc":"The difference between thin conformal coatings (acrylic, varnish) and a thicker plastic-based protective coating for PCBs.",
"intro":"Many circuit-protection products are thin, transparent conformal coatings. Liquid PCB Plastic Coating takes a different approach. Understanding the difference helps you choose the right protection.",
"secs":[("What conformal coatings do well","Thin acrylic or varnish-type coatings are good against humidity, dust and light corrosion. They are very thin and add minimal weight — ideal when only moisture protection is needed."),
("How a plastic-based coating differs","A plastic-based coating builds a thicker, harder, non-transparent layer. Beyond moisture protection it adds mechanical resistance, edge reinforcement and visual concealment, and can be built up in layers."),
("Mechanical protection","Thin coatings can be vulnerable to scratches and abrasion. A reinforced plastic-based layer is harder after curing and better for boards that are washed, handled or vibrated."),
("Which should you choose?","For light indoor moisture protection, a thin conformal coating may be enough. For harsh environments, immersion risk or mechanical stress, a thicker plastic-based coating is stronger.")],
"close":"MG TECH's Liquid PCB Plastic Coating is a reinforced, heat-free plastic-based coating that combines water protection, mechanical strength and non-transparent coverage."},
"fa":{"title":"پوشش Conformal در برابر پوشش محافظ پلاستیکی مایع",
"desc":"تفاوت پوشش‌های نازک Conformal (اکریلیک، وارنیش) با پوشش محافظ ضخیم‌ترِ بر پایه پلاستیک برای بردهای PCB.",
"intro":"بسیاری از محصولات محافظت مدار، پوشش‌های نازک و شفاف Conformal هستند. Liquid PCB Plastic Coating رویکرد متفاوتی دارد. درک این تفاوت به انتخاب محافظت درست کمک می‌کند.",
"secs":[("پوشش‌های Conformal در چه چیزی خوب‌اند","پوشش‌های نازک اکریلیک یا وارنیش‌مانند در برابر رطوبت، گردوغبار و خوردگی سبک خوب‌اند. خیلی نازک‌اند و وزن کمی اضافه می‌کنند — مناسب جایی که فقط محافظت رطوبتی لازم است."),
("تفاوت پوشش بر پایه پلاستیک","پوشش بر پایه پلاستیک یک لایهٔ ضخیم‌تر، سخت‌تر و غیرشفاف می‌سازد. علاوه بر محافظت رطوبتی، مقاومت مکانیکی، تقویت لبه و پنهان‌سازی بصری اضافه می‌کند و می‌تواند لایه‌لایه ساخته شود."),
("محافظت مکانیکی","پوشش‌های نازک می‌توانند در برابر خراش و سایش آسیب‌پذیر باشند. یک لایهٔ تقویت‌شدهٔ پلاستیکی پس از خشک‌شدن سخت‌تر است و برای بردهایی که شسته، جابه‌جا یا دچار لرزش می‌شوند بهتر است."),
("کدام را انتخاب کنید؟","برای محافظت رطوبتی سبکِ داخل ساختمان، یک پوشش نازک Conformal کافی است. برای شرایط سخت، ریسک غوطه‌وری یا تنش مکانیکی، پوشش ضخیم‌تر پلاستیکی قوی‌تر است.")],
"close":"Liquid PCB Plastic Coating محصول MG TECH یک پوشش تقویت‌شده، بدون حرارت و بر پایه پلاستیک است که محافظت در برابر آب، استحکام مکانیکی و پوشش غیرشفاف را با هم دارد."},
"ru":{"title":"Конформное покрытие против жидкого пластикового покрытия",
"desc":"Разница между тонкими конформными покрытиями (акрил, лак) и более толстым покрытием на пластиковой основе для плат.",
"intro":"Многие средства защиты плат — это тонкие прозрачные конформные покрытия. Liquid PCB Plastic Coating работает иначе. Понимание разницы помогает выбрать правильную защиту.",
"secs":[("В чём хороши конформные покрытия","Тонкие акриловые или лаковые покрытия хороши против влаги, пыли и лёгкой коррозии. Они очень тонкие и почти не добавляют веса — идеальны, когда нужна только защита от влаги."),
("Чем отличается пластиковое покрытие","Покрытие на пластиковой основе образует более толстый, твёрдый, непрозрачный слой. Помимо защиты от влаги оно добавляет механическую стойкость, усиление краёв и визуальное скрытие, и наносится слоями."),
("Механическая защита","Тонкие покрытия уязвимы к царапинам и истиранию. Усиленный пластиковый слой твёрже после отверждения и лучше для плат, которые моют, берут в руки или подвергают вибрации."),
("Что выбрать?","Для лёгкой защиты от влаги в помещении достаточно тонкого конформного покрытия. Для тяжёлых условий, риска погружения или механических нагрузок прочнее покрытие на пластиковой основе.")],
"close":"Liquid PCB Plastic Coating от MG TECH — усиленное покрытие на пластиковой основе без нагрева, сочетающее водозащиту, механическую прочность и непрозрачность."},
"tr":{"title":"Konformal Kaplama ile Sıvı Plastik Koruyucu Kaplama",
"desc":"İnce konformal kaplamalar (akrilik, vernik) ile daha kalın plastik esaslı koruyucu kaplama arasındaki fark.",
"intro":"Birçok devre koruma ürünü ince, şeffaf konformal kaplamadır. Liquid PCB Plastic Coating farklı bir yaklaşım benimser. Farkı anlamak doğru korumayı seçmenize yardımcı olur.",
"secs":[("Konformal kaplamalar neyde iyidir","İnce akrilik veya vernik tipi kaplamalar neme, toza ve hafif korozyona karşı iyidir. Çok incedir ve çok az ağırlık ekler — yalnızca nem koruması gerektiğinde idealdir."),
("Plastik esaslı kaplama nasıl farklıdır","Plastik esaslı kaplama daha kalın, daha sert, opak bir katman oluşturur. Nem korumasının ötesinde mekanik direnç, kenar güçlendirmesi ve görsel gizleme ekler ve katmanlı yapılabilir."),
("Mekanik koruma","İnce kaplamalar çizik ve aşınmaya karşı savunmasız olabilir. Güçlendirilmiş plastik katman kürlendikten sonra daha serttir; yıkanan, elle tutulan veya titreşen kartlar için daha iyidir."),
("Hangisini seçmelisiniz?","Hafif iç mekân nem koruması için ince bir konformal kaplama yeterli olabilir. Zorlu ortamlar, daldırma riski veya mekanik gerilim için daha kalın plastik esaslı kaplama daha güçlüdür.")],
"close":"MG TECH'in Liquid PCB Plastic Coating ürünü; su korumasını, mekanik dayanımı ve opak kaplamayı birleştiren, güçlendirilmiş, ısı gerektirmeyen plastik esaslı bir kaplamadır."},
"ar":{"title":"الطلاء المطابق مقابل الطلاء البلاستيكي السائل الواقي",
"desc":"الفرق بين الطلاءات المطابقة الرقيقة (أكريليك، ورنيش) والطلاء الواقي الأسمك القائم على البلاستيك للوحات PCB.",
"intro":"كثير من منتجات حماية الدوائر طلاءات مطابقة رقيقة وشفافة. يتبع Liquid PCB Plastic Coating نهجاً مختلفاً. فهم الفرق يساعدك على اختيار الحماية المناسبة.",
"secs":[("فيمَ تتميّز الطلاءات المطابقة","الطلاءات الرقيقة من الأكريليك أو الورنيش جيدة ضد الرطوبة والغبار والتآكل الخفيف. رقيقة جداً وتضيف وزناً ضئيلاً — مثالية عند الحاجة للحماية من الرطوبة فقط."),
("كيف يختلف الطلاء البلاستيكي","يُكوّن الطلاء القائم على البلاستيك طبقة أسمك وأصلب وغير شفافة. إلى جانب الحماية من الرطوبة يضيف مقاومة ميكانيكية وتقوية للحواف وإخفاءً بصرياً، ويمكن بناؤه طبقات."),
("الحماية الميكانيكية","الطلاءات الرقيقة قد تكون عرضة للخدش والتآكل. الطبقة البلاستيكية المعزّزة أصلب بعد الجفاف وأفضل للوحات التي تُغسل أو تُمسك أو تتعرّض للاهتزاز."),
("أيّهما تختار؟","للحماية الخفيفة من الرطوبة داخل المباني قد يكفي طلاء مطابق رقيق. أما للبيئات القاسية أو خطر الغمر أو الإجهاد الميكانيكي فالطلاء البلاستيكي الأسمك أقوى.")],
"close":"إن Liquid PCB Plastic Coating من MG TECH طلاء معزّز بدون حرارة قائم على البلاستيك يجمع بين الحماية من الماء والقوة الميكانيكية والتغطية غير الشفافة."},
}}

A3={"slug":"waterproofing-drone-fpv-electronics","kw":"waterproof drone electronics, FPV waterproofing, flight controller coating",
"L":{
"en":{"title":"Waterproofing Drone and FPV Electronics",
"desc":"How to protect drone flight controllers, ESCs and FPV boards from rain, humidity and vibration with a protective coating.",
"intro":"Flight controllers, ESCs, receivers and FPV boards face rain, humidity, condensation and constant vibration. A thin coating lets you fly in more conditions and extends the life of sensitive electronics.",
"secs":[("Why drones need coating","A few drops of water on a powered flight controller can cause a short and a crash. Coating creates a moisture barrier so light rain, fog and condensation are far less likely to cause damage."),
("What to coat and what to mask","Coat flight controllers, ESCs, receivers and VTX boards. Mask connectors, antenna pads, USB ports and any sensors that must stay exposed."),
("Keep it light","Drones are weight-sensitive. A thin, even layer protects without meaningfully changing weight or balance; reserve thicker layers for edges and repair points."),
("Vibration and durability","Vibration loosens solder joints over time. A coating that reinforces joints and resists abrasion helps the board survive repeated flights and handling.")],
"close":"Liquid PCB Plastic Coating is applied at room temperature by dipping, spraying or brush — practical for protecting FPV and drone electronics in the workshop or the field."},
"fa":{"title":"ضدآب‌کردن الکترونیک دِرون و FPV",
"desc":"چطور کنترلر پرواز، ESC و بردهای FPV دِرون را با پوشش محافظ در برابر باران، رطوبت و لرزش محافظت کنیم.",
"intro":"کنترلرهای پرواز، ESCها، گیرنده‌ها و بردهای FPV در معرض باران، رطوبت، میعان و لرزش دائم‌اند. یک پوشش نازک اجازه می‌دهد در شرایط بیشتری پرواز کنی و عمر الکترونیک حساس را بالا می‌برد.",
"secs":[("چرا دِرون به پوشش نیاز دارد","چند قطره آب روی کنترلر پروازِ روشن می‌تواند باعث اتصال‌کوتاه و سقوط شود. پوشش یک سد رطوبتی می‌سازد تا باران سبک، مه و میعان خیلی کمتر آسیب بزنند."),
("چه چیزی را بپوشانیم و چه چیزی را ماسک کنیم","کنترلر پرواز، ESC، گیرنده و بردهای VTX را پوشش بدهید. کانکتورها، پدهای آنتن، پورت USB و هر سنسوری که باید باز بماند را ماسک کنید."),
("سبک نگه‌اش دارید","دِرون به وزن حساس است. یک لایهٔ نازک و یکنواخت بدون تغییر محسوس وزن یا تعادل محافظت می‌کند؛ لایه‌های ضخیم‌تر را فقط برای لبه‌ها و نقاط تعمیر نگه دارید."),
("لرزش و دوام","لرزش به‌مرور نقاط لحیم را شل می‌کند. پوششی که اتصالات را تقویت و در برابر سایش مقاومت می‌کند به دوام برد در پروازهای مکرر کمک می‌کند.")],
"close":"Liquid PCB Plastic Coating در دمای محیط با غوطه‌وری، اسپری یا قلم‌مو اجرا می‌شود — کاربردی برای محافظت از الکترونیک FPV و دِرون در کارگاه یا میدان."},
"ru":{"title":"Гидроизоляция электроники дронов и FPV",
"desc":"Как защитить полётные контроллеры, ESC и FPV-платы дрона от дождя, влаги и вибрации защитным покрытием.",
"intro":"Полётные контроллеры, ESC, приёмники и FPV-платы подвержены дождю, влаге, конденсату и постоянной вибрации. Тонкое покрытие позволяет летать в большем числе условий и продлевает срок службы электроники.",
"secs":[("Зачем дронам покрытие","Несколько капель воды на работающем полётном контроллере могут вызвать короткое замыкание и падение. Покрытие создаёт барьер от влаги, и лёгкий дождь, туман и конденсат гораздо реже причиняют вред."),
("Что покрывать и что маскировать","Покрывайте полётные контроллеры, ESC, приёмники и VTX-платы. Маскируйте разъёмы, площадки антенн, порты USB и датчики, которые должны оставаться открытыми."),
("Сохраняйте лёгкость","Дроны чувствительны к весу. Тонкий ровный слой защищает, почти не меняя вес или баланс; более толстые слои оставьте для краёв и зон ремонта."),
("Вибрация и надёжность","Вибрация со временем ослабляет пайки. Покрытие, усиливающее соединения и стойкое к истиранию, помогает плате пережить многократные полёты.")],
"close":"Liquid PCB Plastic Coating наносится при комнатной температуре окунанием, распылением или кистью — удобно для защиты FPV- и дрон-электроники в мастерской или в поле."},
"tr":{"title":"Drone ve FPV Elektroniğini Su Geçirmez Yapmak",
"desc":"Drone uçuş kontrolcülerini, ESC'leri ve FPV kartlarını koruyucu kaplamayla yağmurdan, nemden ve titreşimden koruma.",
"intro":"Uçuş kontrolcüleri, ESC'ler, alıcılar ve FPV kartları yağmura, neme, yoğuşmaya ve sürekli titreşime maruz kalır. İnce bir kaplama daha çok koşulda uçmanızı sağlar ve hassas elektroniğin ömrünü uzatır.",
"secs":[("Drone neden kaplama ister","Çalışan bir uçuş kontrolcüsüne düşen birkaç damla su kısa devreye ve düşüşe yol açabilir. Kaplama bir nem bariyeri oluşturur; hafif yağmur, sis ve yoğuşmanın zarar verme olasılığı çok azalır."),
("Ne kaplanmalı, ne maskelenmeli","Uçuş kontrolcülerini, ESC'leri, alıcıları ve VTX kartlarını kaplayın. Konnektörleri, anten padlerini, USB portlarını ve açık kalması gereken sensörleri maskeleyin."),
("Hafif tutun","Drone'lar ağırlığa duyarlıdır. İnce, düzgün bir katman ağırlığı veya dengeyi belirgin değiştirmeden korur; daha kalın katmanları kenarlar ve onarım noktaları için saklayın."),
("Titreşim ve dayanıklılık","Titreşim zamanla lehim noktalarını gevşetir. Bağlantıları güçlendiren ve aşınmaya dayanan bir kaplama, kartın tekrarlı uçuşlara dayanmasına yardımcı olur.")],
"close":"Liquid PCB Plastic Coating oda sıcaklığında daldırma, püskürtme veya fırçayla uygulanır — atölyede veya sahada FPV ve drone elektroniğini korumak için pratiktir."},
"ar":{"title":"عزل إلكترونيات الدرون و FPV ضد الماء",
"desc":"كيف تحمي وحدات تحكم طيران الدرون وأنظمة ESC ولوحات FPV من المطر والرطوبة والاهتزاز بطلاء واقٍ.",
"intro":"تتعرض وحدات تحكم الطيران وأنظمة ESC وأجهزة الاستقبال ولوحات FPV للمطر والرطوبة والتكثّف والاهتزاز المستمر. يتيح لك طلاء رقيق الطيران في ظروف أكثر ويطيل عمر الإلكترونيات الحساسة.",
"secs":[("لماذا يحتاج الدرون إلى طلاء","بضع قطرات ماء على وحدة تحكم طيران تعمل قد تسبّب قصراً وسقوطاً. يُكوّن الطلاء حاجزاً ضد الرطوبة فيقل كثيراً احتمال ضرر المطر الخفيف والضباب والتكثّف."),
("ماذا تطلي وماذا تغطّي","اطلِ وحدات التحكم وأنظمة ESC وأجهزة الاستقبال ولوحات VTX. غطِّ الموصلات وأطراف الهوائي ومنافذ USB وأي حساسات يجب أن تبقى مكشوفة."),
("حافظ على الخفّة","الدرون حسّاس للوزن. طبقة رقيقة متساوية تحمي دون تغيير ملموس في الوزن أو التوازن؛ واترك الطبقات الأسمك للحواف ونقاط الإصلاح."),
("الاهتزاز والمتانة","يُرخي الاهتزاز نقاط اللحام مع الوقت. الطلاء الذي يقوّي الوصلات ويقاوم التآكل يساعد اللوحة على تحمّل الرحلات المتكررة.")],
"close":"يُطبَّق Liquid PCB Plastic Coating في درجة حرارة الغرفة بالغمس أو الرش أو الفرشاة — عمليٌّ لحماية إلكترونيات FPV والدرون في الورشة أو الميدان."},
}}
A4={"slug":"waterproofing-cctv-outdoor-camera-electronics","kw":"waterproof CCTV camera, outdoor camera coating, security camera PCB protection",
"L":{
"en":{"title":"Waterproofing CCTV and Outdoor Camera Electronics",
"desc":"How to protect outdoor security camera boards, connectors and IR modules from rain, fog and humidity with a protective coating.",
"intro":"Outdoor security cameras live in rain, fog, temperature swings and condensation. Even IP-rated housings can let moisture in through cable entries and aging seals. Coating the internal board adds a second line of defense.",
"secs":[("Where moisture gets in","Most outdoor cameras fail not because the lens floods, but because humid air enters through cable glands and worn gaskets and then condenses on the board. A coating protects the electronics even when the housing seal weakens."),
("Coat the board, mask the optics","Apply the coating to the main PCB, power section and connector pads. Mask the image sensor, lens, IR LEDs and microphone so image and audio performance stay unchanged."),
("Protect connectors and cable entries","Corrosion at the RJ45 or power connector is a common failure point. Reinforce these areas and the cable entry with a brushed layer for extra moisture and salt resistance."),
("Result: fewer field failures","A coated board survives fog, light leaks and condensation far better, which means fewer service visits and longer camera life in outdoor and coastal installations.")],
"close":"Liquid PCB Plastic Coating by MG TECH is a heat-free, plastic-based nano coating made for waterproofing PCBs, sensors and electronic circuits with mechanical reinforcement."},
"fa":{"title":"ضدآب‌کردن الکترونیک دوربین مداربسته و دوربین‌های فضای باز",
"desc":"چطور برد، کانکتورها و ماژول‌های IR دوربین‌های امنیتی فضای باز را با پوشش محافظ در برابر باران، مه و رطوبت محافظت کنیم.",
"intro":"دوربین‌های امنیتی فضای باز با باران، مه، تغییرات دما و میعان دست‌وپنجه نرم می‌کنند. حتی محفظه‌های دارای استاندارد IP هم می‌توانند از مسیر ورودی کابل و آب‌بندهای فرسوده رطوبت را به داخل راه دهند. پوشش‌دادن برد داخلی یک خط دفاعی دوم اضافه می‌کند.",
"secs":[("رطوبت از کجا وارد می‌شود","بیشتر دوربین‌های فضای باز نه به‌خاطر نفوذ آب به لنز، بلکه به این دلیل خراب می‌شوند که هوای مرطوب از گلَند کابل و واشرهای فرسوده وارد و روی برد میعان می‌کند. پوشش حتی وقتی آب‌بندی محفظه ضعیف شود از الکترونیک محافظت می‌کند."),
("برد را بپوشانید، اپتیک را ماسک کنید","پوشش را روی برد اصلی، بخش تغذیه و پدهای کانکتور اجرا کنید. سنسور تصویر، لنز، LEDهای مادون‌قرمز و میکروفون را ماسک کنید تا کیفیت تصویر و صدا تغییر نکند."),
("محافظت از کانکتورها و ورودی کابل","خوردگی در کانکتور RJ45 یا تغذیه یکی از نقاط رایج خرابی است. این نواحی و ورودی کابل را با یک لایهٔ قلم‌مویی برای مقاومت بیشتر در برابر رطوبت و نمک تقویت کنید."),
("نتیجه: خرابی کمتر در محل","بردِ پوشش‌داده‌شده در برابر مه، نفوذ نور و میعان بسیار بهتر دوام می‌آورد؛ یعنی مراجعهٔ سرویس کمتر و عمر بیشتر دوربین در نصب‌های فضای باز و ساحلی.")],
"close":"Liquid PCB Plastic Coating محصول MG TECH یک پوشش نانویی بر پایه پلاستیک و بدون حرارت است که برای ضدآب‌کردن بردها، سنسورها و مدارهای الکترونیکی همراه با تقویت مکانیکی ساخته شده است."},
"ru":{"title":"Гидроизоляция электроники камер видеонаблюдения и уличных камер",
"desc":"Как защитить платы, разъёмы и ИК-модули уличных камер видеонаблюдения от дождя, тумана и влаги защитным покрытием.",
"intro":"Уличные камеры видеонаблюдения работают в дожде, тумане, при перепадах температуры и конденсате. Даже корпуса со степенью защиты IP могут пропускать влагу через кабельные вводы и стареющие уплотнения. Покрытие внутренней платы добавляет второй рубеж защиты.",
"secs":[("Где проникает влага","Большинство уличных камер выходят из строя не из-за затопления объектива, а потому что влажный воздух проникает через кабельные вводы и изношенные прокладки и конденсируется на плате. Покрытие защищает электронику даже при ослаблении уплотнения корпуса."),
("Покройте плату, замаскируйте оптику","Нанесите покрытие на основную плату, блок питания и площадки разъёмов. Замаскируйте матрицу, объектив, ИК-светодиоды и микрофон, чтобы качество изображения и звука не изменилось."),
("Защитите разъёмы и кабельные вводы","Коррозия на разъёме RJ45 или питания — частая точка отказа. Усилите эти зоны и кабельный ввод нанесённым кистью слоем для дополнительной стойкости к влаге и соли."),
("Итог: меньше отказов на объекте","Покрытая плата гораздо лучше переносит туман, протечки света и конденсат, а значит — меньше выездов сервиса и больше срок службы камеры на уличных и прибрежных объектах.")],
"close":"Liquid PCB Plastic Coating от MG TECH — это нанопокрытие на пластиковой основе без нагрева для гидроизоляции плат, датчиков и электронных схем с механическим усилением."},
"tr":{"title":"CCTV ve Dış Mekân Kamera Elektroniğini Su Geçirmez Yapmak",
"desc":"Dış mekân güvenlik kamerası kartlarını, konnektörleri ve IR modüllerini koruyucu kaplamayla yağmurdan, sisten ve nemden koruma.",
"intro":"Dış mekân güvenlik kameraları yağmur, sis, sıcaklık değişimleri ve yoğuşma içinde yaşar. IP korumalı muhafazalar bile kablo girişlerinden ve eskiyen contalardan nem alabilir. İç kartı kaplamak ikinci bir savunma hattı ekler.",
"secs":[("Nem nereden girer","Çoğu dış mekân kamerası lens su aldığı için değil, nemli hava kablo rakorlarından ve yıpranmış contalardan girip kart üzerinde yoğuştuğu için arızalanır. Kaplama, muhafaza contası zayıfladığında bile elektroniği korur."),
("Kartı kaplayın, optiği maskeleyin","Kaplamayı ana karta, güç bölümüne ve konnektör padlerine uygulayın. Görüntü ve ses performansının değişmemesi için görüntü sensörünü, lensi, IR LED'leri ve mikrofonu maskeleyin."),
("Konnektörleri ve kablo girişlerini koruyun","RJ45 veya güç konnektöründeki korozyon yaygın bir arıza noktasıdır. Neme ve tuza karşı ekstra direnç için bu bölgeleri ve kablo girişini fırçayla bir katmanla güçlendirin."),
("Sonuç: sahada daha az arıza","Kaplı bir kart sisi, ışık sızıntısını ve yoğuşmayı çok daha iyi atlatır; bu da dış mekân ve kıyı kurulumlarında daha az servis ziyareti ve daha uzun kamera ömrü demektir.")],
"close":"MG TECH'in Liquid PCB Plastic Coating ürünü; PCB'leri, sensörleri ve elektronik devreleri mekanik güçlendirmeyle su geçirmez yapmak için ısı gerektirmeyen, plastik esaslı bir nano kaplamadır."},
"ar":{"title":"عزل إلكترونيات كاميرات المراقبة والكاميرات الخارجية ضد الماء",
"desc":"كيف تحمي لوحات كاميرات المراقبة الخارجية وموصلاتها ووحدات الأشعة تحت الحمراء من المطر والضباب والرطوبة بطلاء واقٍ.",
"intro":"تعيش كاميرات المراقبة الخارجية في المطر والضباب وتقلّبات الحرارة والتكثّف. حتى الصناديق ذات تصنيف IP قد تسمح بدخول الرطوبة عبر مداخل الكابلات والحشوات المتقادمة. طلاء اللوحة الداخلية يضيف خط دفاع ثانياً.",
"secs":[("من أين تدخل الرطوبة","معظم الكاميرات الخارجية لا تتعطّل لأن العدسة غُمرت بالماء، بل لأن الهواء الرطب يدخل عبر مداخل الكابلات والحشوات البالية ثم يتكثّف على اللوحة. يحمي الطلاء الإلكترونيات حتى عند ضعف عزل الصندوق."),
("اطلِ اللوحة وغطِّ البصريات","طبّق الطلاء على اللوحة الرئيسية وقسم الطاقة وأطراف الموصلات. غطِّ مستشعر الصورة والعدسة ومصابيح الأشعة تحت الحمراء والميكروفون لئلا يتغيّر أداء الصورة والصوت."),
("احمِ الموصلات ومداخل الكابلات","التآكل عند موصل RJ45 أو الطاقة نقطة عطل شائعة. قوِّ هذه المناطق ومدخل الكابل بطبقة بالفرشاة لمقاومة أكبر للرطوبة والملح."),
("النتيجة: أعطال أقل في الميدان","تتحمّل اللوحة المطلية الضباب وتسرّب الضوء والتكثّف أفضل بكثير، ما يعني زيارات صيانة أقل وعمراً أطول للكاميرا في التركيبات الخارجية والساحلية.")],
"close":"إن Liquid PCB Plastic Coating من MG TECH طلاء نانوي قائم على البلاستيك وبدون حرارة، مصمّم لعزل لوحات PCB والحساسات والدوائر الإلكترونية مع تقوية ميكانيكية."},
}}

A5={"slug":"protecting-car-ecu-automotive-electronics","kw":"waterproof car ECU, automotive electronics coating, ECU moisture protection",
"L":{
"en":{"title":"Protecting Car ECUs and Automotive Electronics from Moisture",
"desc":"How to waterproof car ECUs, sensor boards and control modules against humidity, washing and corrosion with a protective coating.",
"intro":"Automotive electronics face humidity, temperature cycling, road salt, vibration and the occasional water ingress. A protective coating on the board helps ECUs, sensors and control modules survive years in a harsh under-hood or under-body environment.",
"secs":[("Why automotive boards fail","Under-hood heat cycling pulls humid air in and out of modules; over time moisture and road salt corrode tracks and solder joints. A coating seals the copper and pads against this slow corrosion."),
("What to coat","Engine and body control modules, sensor boards, dashboard electronics and aftermarket modules all benefit. Apply an even layer over tracks, components and solder joints."),
("Mask connectors and grounds","Mask multi-pin connectors, programming and diagnostic pads, press-fit pins and chassis-ground contacts so electrical connections and serviceability are preserved."),
("Vibration and salt resistance","Constant vibration fatigues solder joints and salt accelerates corrosion. A reinforced coating that resists abrasion and chemicals helps modules last in real road conditions.")],
"close":"Liquid PCB Plastic Coating by MG TECH is a heat-free, plastic-based nano coating made for waterproofing PCBs, sensors and electronic circuits with mechanical reinforcement."},
"fa":{"title":"محافظت از ECU خودرو و الکترونیک خودرو در برابر رطوبت",
"desc":"چطور ECU خودرو، بردهای سنسور و ماژول‌های کنترل را با پوشش محافظ در برابر رطوبت، شست‌وشو و خوردگی ضدآب کنیم.",
"intro":"الکترونیک خودرو با رطوبت، چرخهٔ دمایی، نمک جاده، لرزش و گاهی نفوذ آب روبه‌روست. یک پوشش محافظ روی برد کمک می‌کند ECUها، سنسورها و ماژول‌های کنترل سال‌ها در محیط سخت زیر کاپوت یا زیر بدنه دوام بیاورند.",
"secs":[("چرا بردهای خودرو خراب می‌شوند","چرخهٔ گرمایی زیر کاپوت هوای مرطوب را به داخل و خارج ماژول می‌کشد؛ به‌مرور رطوبت و نمک جاده مسیرها و نقاط لحیم را می‌خورند. پوشش، مس و پدها را در برابر این خوردگی آرام آب‌بندی می‌کند."),
("چه چیزی را بپوشانیم","ماژول‌های کنترل موتور و بدنه، بردهای سنسور، الکترونیک داشبورد و ماژول‌های افترمارکت همگی سود می‌برند. یک لایهٔ یکنواخت روی مسیرها، قطعات و نقاط لحیم اجرا کنید."),
("کانکتورها و اتصال‌بدنه را ماسک کنید","کانکتورهای چندپین، پدهای برنامه‌ریزی و عیب‌یابی، پین‌های پرس‌فیت و کنتاکت‌های اتصال‌بدنه را ماسک کنید تا اتصالات الکتریکی و قابلیت سرویس حفظ شود."),
("مقاومت در برابر لرزش و نمک","لرزش دائم نقاط لحیم را خسته می‌کند و نمک خوردگی را تسریع می‌کند. یک پوشش تقویت‌شده که در برابر سایش و مواد شیمیایی مقاوم است به دوام ماژول‌ها در شرایط واقعی جاده کمک می‌کند.")],
"close":"Liquid PCB Plastic Coating محصول MG TECH یک پوشش نانویی بر پایه پلاستیک و بدون حرارت است که برای ضدآب‌کردن بردها، سنسورها و مدارهای الکترونیکی همراه با تقویت مکانیکی ساخته شده است."},
"ru":{"title":"Защита автомобильных ЭБУ и электроники от влаги",
"desc":"Как сделать автомобильные ЭБУ, платы датчиков и модули управления водостойкими против влаги, мойки и коррозии защитным покрытием.",
"intro":"Автомобильная электроника сталкивается с влагой, температурными циклами, дорожной солью, вибрацией и иногда с попаданием воды. Защитное покрытие платы помогает ЭБУ, датчикам и модулям управления служить годами в суровых условиях под капотом или под днищем.",
"secs":[("Почему автомобильные платы выходят из строя","Температурные циклы под капотом затягивают влажный воздух в модули и обратно; со временем влага и дорожная соль разъедают дорожки и пайки. Покрытие герметизирует медь и площадки от этой медленной коррозии."),
("Что покрывать","Модули управления двигателем и кузовом, платы датчиков, электроника приборной панели и дополнительные модули — все они выигрывают. Нанесите ровный слой на дорожки, компоненты и пайки."),
("Замаскируйте разъёмы и массу","Замаскируйте многоконтактные разъёмы, площадки программирования и диагностики, запрессованные контакты и точки массы кузова, чтобы сохранить электрические соединения и ремонтопригодность."),
("Стойкость к вибрации и соли","Постоянная вибрация утомляет пайки, а соль ускоряет коррозию. Усиленное покрытие, стойкое к истиранию и химии, помогает модулям выдерживать реальные дорожные условия.")],
"close":"Liquid PCB Plastic Coating от MG TECH — это нанопокрытие на пластиковой основе без нагрева для гидроизоляции плат, датчиков и электронных схем с механическим усилением."},
"tr":{"title":"Araç ECU'larını ve Otomotiv Elektroniğini Nemden Koruma",
"desc":"Araç ECU'larını, sensör kartlarını ve kontrol modüllerini koruyucu kaplamayla neme, yıkamaya ve korozyona karşı su geçirmez yapma.",
"intro":"Otomotiv elektroniği nem, sıcaklık döngüsü, yol tuzu, titreşim ve zaman zaman su girişiyle karşılaşır. Kart üzerindeki koruyucu kaplama; ECU'ların, sensörlerin ve kontrol modüllerinin zorlu motor bölmesi veya alt gövde ortamında yıllarca dayanmasına yardımcı olur.",
"secs":[("Otomotiv kartları neden arızalanır","Motor bölmesindeki sıcaklık döngüsü nemli havayı modüllerin içine ve dışına çeker; zamanla nem ve yol tuzu yolları ve lehim noktalarını aşındırır. Kaplama, bakırı ve padleri bu yavaş korozyona karşı sızdırmaz hâle getirir."),
("Ne kaplanmalı","Motor ve karoseri kontrol modülleri, sensör kartları, gösterge paneli elektroniği ve satış sonrası modüllerin hepsi fayda görür. Yollara, bileşenlere ve lehim noktalarına düzgün bir katman uygulayın."),
("Konnektörleri ve şasi topraklarını maskeleyin","Çok pinli konnektörleri, programlama ve teşhis padlerini, geçme pinleri ve şasi toprak kontaklarını maskeleyin; böylece elektriksel bağlantılar ve servis edilebilirlik korunur."),
("Titreşim ve tuz direnci","Sürekli titreşim lehim noktalarını yorar, tuz korozyonu hızlandırır. Aşınmaya ve kimyasallara dayanan güçlendirilmiş bir kaplama, modüllerin gerçek yol koşullarında dayanmasına yardımcı olur.")],
"close":"MG TECH'in Liquid PCB Plastic Coating ürünü; PCB'leri, sensörleri ve elektronik devreleri mekanik güçlendirmeyle su geçirmez yapmak için ısı gerektirmeyen, plastik esaslı bir nano kaplamadır."},
"ar":{"title":"حماية وحدات تحكم السيارة (ECU) وإلكترونياتها من الرطوبة",
"desc":"كيف تجعل وحدات تحكم السيارة ولوحات الحساسات ووحدات التحكم مقاومة للماء ضد الرطوبة والغسيل والتآكل بطلاء واقٍ.",
"intro":"تواجه إلكترونيات السيارات الرطوبة والدورات الحرارية وملح الطريق والاهتزاز وأحياناً دخول الماء. طلاء واقٍ على اللوحة يساعد وحدات التحكم والحساسات ووحدات التحكم على الصمود سنوات في بيئة حجرة المحرك أو أسفل الهيكل القاسية.",
"secs":[("لماذا تتعطّل لوحات السيارات","تسحب الدورات الحرارية في حجرة المحرك الهواء الرطب إلى داخل الوحدات وخارجها؛ ومع الوقت تُتلف الرطوبة وملح الطريق المسارات ونقاط اللحام. يعزل الطلاء النحاس والأطراف ضد هذا التآكل البطيء."),
("ماذا تطلي","وحدات التحكم بالمحرك والهيكل، ولوحات الحساسات، وإلكترونيات لوحة العدادات، والوحدات الإضافية كلها تستفيد. طبّق طبقة متساوية على المسارات والمكوّنات ونقاط اللحام."),
("غطِّ الموصلات ونقاط التأريض","غطِّ الموصلات متعددة الأطراف وأطراف البرمجة والتشخيص والدبابيس المضغوطة ونقاط تأريض الهيكل للحفاظ على التوصيلات الكهربائية وقابلية الصيانة."),
("مقاومة الاهتزاز والملح","الاهتزاز المستمر يُجهد نقاط اللحام والملح يسرّع التآكل. طلاء معزّز يقاوم التآكل والمواد الكيميائية يساعد الوحدات على الصمود في ظروف الطريق الحقيقية.")],
"close":"إن Liquid PCB Plastic Coating من MG TECH طلاء نانوي قائم على البلاستيك وبدون حرارة، مصمّم لعزل لوحات PCB والحساسات والدوائر الإلكترونية مع تقوية ميكانيكية."},
}}
A6={"slug":"nanostructured-protective-coating-pcb","kw":"PCB protective coating, conformal coating, nanostructured coating, IPC-CC-830, IEC 61086, waterproof PCB, electronic circuit protection, plastic coating",
"L":{
"en":{"title":"Nanostructured Protective Coating for PCBs and Electronics: Environmental, Mechanical and Waterproof Reliability",
"desc":"A technical guide to nanostructured protective (conformal) coatings for PCBs and electronic circuits: why boards fail, the IPC-CC-830 and IEC 61086 evaluation frameworks, and how a heat-free, multi-layer, plastic-based coating protects against water, humidity, corrosion and mechanical stress.",
"intro":"As electronic circuits spread into automotive, industrial, marine, humid and outdoor environments, protecting printed circuit boards (PCBs) from moisture, water, contamination, corrosion, temperature swings and mechanical stress has become a core reliability challenge. Protective coatings, often called conformal coatings, are a well-established way to extend the service life and dependability of electronic assemblies. This article reviews why protection matters, the international frameworks used to evaluate it, and how a nanostructured, heat-free, plastic-based coating fits these needs.",
"secs":[("Why electronic boards fail in the field","A leading cause of field failure is the ingress of moisture and ionic contamination onto the board surface. Together they create unwanted conductive paths, lower the surface insulation resistance, corrode metal tracks and eventually disrupt circuit operation. A protective coating forms a barrier between the board and its environment, reducing direct contact between contaminants, moisture and the conductive traces and components."),
("What a protective (conformal) coating does","A conformal coating is a thin polymeric protective layer that follows the contours of the PCB. It shields boards, components and assemblies from moisture, thermal shock, static, vibration and contamination, helping to maintain dielectric strength, functional integrity and long-term reliability. In demanding applications the goal is not only to resist a brief splash of water, but to keep the circuit stable over time under repeated environmental stress."),
("Evaluation frameworks: IPC-CC-830 and IEC 61086","Several international standards define how protective coatings should be evaluated. IPC-CC-830 specifies qualification and conformance requirements for electrical insulating compounds applied to printed wiring assemblies, aiming to build confidence in coating performance and reduce unnecessary repeat testing. IEC 61086 defines, classifies and sets requirements for coatings used on loaded printed wire boards, including general, high-reliability and aerospace use. These frameworks make clear that a coating should be judged by measured performance, such as insulation resistance, humidity, thermal stability, adhesion, mechanical resistance and contamination resistance, not by a generic waterproof claim alone."),
("A nanostructured, heat-free plastic-based coating","The coating discussed here is an advanced protective technology designed to form a strong, non-transparent, plastic-based layer on the board surface. Unlike very thin films that act mainly as a surface insulator, it is engineered as a reinforced protective layer that can be built up in several passes to increase thickness and protection where moisture, immersion, vibration or contamination are severe. A key practical feature is that it requires no heat: it dries and forms its protective layer at room temperature, which avoids stressing heat-sensitive components, solder joints, connectors and precision modules."),
("Functional advantages","The coating can be applied by dipping, spraying or brushing, making it suitable for both specialist repair and industrial use. After curing it develops meaningful mechanical resistance, which matters where boards also face handling, vibration, dust or light physical stress. Its non-transparent nature hides traces, components and board architecture from direct view, acting as a visual barrier against reverse engineering. Multi-layer application lets the thickness and protection level be tuned to each application, and the heat-free process keeps it compatible with sensitive assemblies."),
("Industrial applications","The coating suits a wide range of uses: automotive ECUs, sensors, LED modules, control boards and motorcycle electronics; industrial control boards, environmental sensors and outdoor equipment; marine electronics exposed to water and humidity; and drones and FPV systems facing rain, dust and changing conditions. In LED products in particular, moisture and contamination can shorten life or cause shorts, so an appropriate protective coating helps maintain long-term stability."),
("Testing and validation","While the functional design is compelling, the professional path to industrial adoption is structured testing and documented results. Relevant tests include surface insulation resistance, humidity resistance, thermal cycling, adhesion, mechanical durability, contamination resistance, salt-spray and UV resistance, post-immersion performance and short-circuit checks. Consistent with IPC-CC-830 and IEC 61086, material selection should be based on the real requirements of each application and validated under realistic, repeatable conditions rather than a general specification alone.")],
"close":"Protective coatings are an essential tool for keeping electronic circuits reliable in harsh environments. A nanostructured, plastic-based coating that applies without heat, builds up in layers, is mechanically resistant after curing, protects against water and humidity, and stays non-transparent to limit reverse engineering offers a practical industrial route to advanced board protection. Compared with common coatings such as acrylic, silicone, polyurethane, epoxy and parylene, MGCoat Liquid PCB Plastic Coating is positioned not as a thin insulating film but as a reinforced, heat-free plastic protective layer for combined environmental and mechanical protection. To consolidate its position, performance testing within the IPC and IEC frameworks, documented as technical data and lab reports, is recommended."},
"fa":{"title":"پوشش محافظ نانوساختار برای PCB و مدارهای الکترونیکی: پایداری محیطی، مکانیکی و ضدآب",
"desc":"راهنمای فنی پوشش‌های محافظ نانوساختار (Conformal) برای بردهای PCB و مدارهای الکترونیکی: چرا بردها خراب می‌شوند، چارچوب‌های ارزیابی IPC-CC-830 و IEC 61086، و چگونه یک پوشش بدون حرارت، چندلایه و پلاستیک‌پایه در برابر آب، رطوبت، خوردگی و تنش مکانیکی محافظت می‌کند.",
"intro":"با گسترش استفاده از مدارهای الکترونیکی در محیط‌های صنعتی، خودرویی، دریایی، مرطوب و فضای باز، حفاظت از بردهای PCB در برابر رطوبت، آب، آلودگی، خوردگی، نوسانات دمایی و تنش‌های مکانیکی به یکی از چالش‌های مهم طراحی و نگهداری سامانه‌های الکترونیکی تبدیل شده است. پوشش‌های محافظ (Conformal Coatings) روشی شناخته‌شده برای افزایش دوام و قابلیت اطمینان بردهای الکترونیکی‌اند. این مقاله مرور می‌کند که چرا این حفاظت مهم است، با چه چارچوب‌هایی ارزیابی می‌شود، و یک پوشش نانوساختارِ بدون حرارت و پلاستیک‌پایه چگونه با این نیازها هماهنگ است.",
"secs":[("چرا بردهای الکترونیکی در محیط خراب می‌شوند","یکی از دلایل اصلی خرابی، نفوذ رطوبت و آلودگی یونی به سطح مدار است. رطوبت در کنار آلودگی می‌تواند مسیرهای رسانای ناخواسته ایجاد کند، مقاومت عایقی سطح را کاهش دهد، مسیرهای فلزی را دچار خوردگی کند و عملکرد مدار را مختل سازد. پوشش محافظ با ایجاد یک لایهٔ مانع بین سطح مدار و محیط، تماس مستقیم آلودگی و رطوبت با مسیرهای رسانا و قطعات را کاهش می‌دهد."),
("پوشش محافظ (Conformal) چه می‌کند","Conformal Coating یک لایهٔ پلیمری محافظ است که با شکل سطح PCB منطبق می‌شود و برد، قطعات و مجموعه را در برابر رطوبت، شوک حرارتی، الکتریسیتهٔ ساکن، لرزش و آلودگی محافظت می‌کند. این لایه به افزایش مقاومت دی‌الکتریک، یکپارچگی عملکردی و قابلیت اطمینان کمک می‌کند. در کاربردهای صنعتی هدف فقط مقاومت در برابر یک تماس لحظه‌ای با آب نیست، بلکه پایداری مدار در طول زمان زیر تنش‌های محیطی مکرر است."),
("چارچوب‌های ارزیابی: IPC-CC-830 و IEC 61086","چند استاندارد بین‌المللی نحوهٔ ارزیابی پوشش‌های محافظ را تعریف می‌کنند. IPC-CC-830 الزامات qualification و conformance را برای ترکیبات عایق الکتریکیِ مورد استفاده روی مجموعه‌های سیم‌کشی چاپی مشخص می‌کند تا اطمینان از عملکرد افزایش و آزمون‌های تکراریِ غیرضروری کاهش یابد. IEC 61086 پوشش‌های مورد استفاده روی بردهای مجهز (loaded) را تعریف، طبقه‌بندی و الزامات آن را شامل کاربردهای عمومی، قابلیت‌اطمینان‌بالا و هوافضا تعیین می‌کند. این چارچوب‌ها روشن می‌کنند که پوشش باید با عملکردِ اندازه‌گیری‌شده، مانند مقاومت عایقی، رطوبت، پایداری حرارتی، چسبندگی، مقاومت مکانیکی و مقاومت در برابر آلودگی، قضاوت شود، نه صرفاً با ادعای کلیِ ضدآب بودن."),
("پوشش نانوساختارِ بدون حرارت و پلاستیک‌پایه","پوشش موردبحث یک فناوری محافظ پیشرفته است که یک لایهٔ مستحکم، غیرشفاف و پلاستیک‌پایه روی سطح مدار می‌سازد. برخلاف فیلم‌های بسیار نازک که عمدتاً نقش عایق سطحی دارند، این پوشش به‌صورت یک لایهٔ تقویت‌شده طراحی شده که می‌تواند چندلایه اجرا شود تا ضخامت و سطح محافظت در شرایط رطوبت شدید، غوطه‌وری، لرزش یا آلودگی افزایش یابد. یک ویژگی کلیدی، عدم نیاز به حرارت است: در دمای محیط خشک می‌شود و لایهٔ محافظ می‌سازد، که از تنش روی قطعات حساس، اتصالات لحیم، کانکتورها و ماژول‌های دقیق جلوگیری می‌کند."),
("مزایای عملکردی","این پوشش با غوطه‌وری، اسپری و قلم‌مو قابل اجراست؛ پس هم برای تعمیرات تخصصی و هم کاربرد صنعتی مناسب است. پس از خشک‌شدن، مقاومت مکانیکی قابل‌توجهی پیدا می‌کند که در شرایط تماس سطحی، لرزش، گردوغبار یا فشار فیزیکی سبک اهمیت دارد. ماهیت غیرشفافش مسیرها، قطعات و معماری برد را از دید مستقیم پنهان می‌کند و به‌عنوان سدی بصری در برابر مهندسی معکوس عمل می‌کند. اجرای چندلایه امکان تنظیم ضخامت و سطح محافظت را فراهم می‌کند و فرایند بدون حرارت آن را با مجموعه‌های حساس سازگار نگه می‌دارد."),
("کاربردهای صنعتی","این پوشش برای طیف وسیعی از کاربردها مناسب است: ECU خودرو، سنسورها، ماژول‌های LED، بردهای کنترل و الکترونیک موتورسیکلت؛ بردهای کنترل صنعتی، سنسورهای محیطی و تجهیزات فضای باز؛ الکترونیک دریایی در معرض آب و رطوبت؛ و پهپادها و سیستم‌های FPV در برابر باران، گردوغبار و شرایط متغیر. به‌ویژه در محصولات LED، رطوبت و آلودگی می‌توانند عمر را کاهش یا اتصال کوتاه ایجاد کنند؛ پوشش محافظ مناسب به پایداری بلندمدت کمک می‌کند."),
("آزمون و اعتبارسنجی","هرچند طراحی عملکردی این پوشش قابل‌توجه است، مسیر حرفه‌ای برای ورود صنعتی، آزمون ساختارمند و مستندسازی نتایج است. آزمون‌های مرتبط شامل مقاومت عایقی سطح، مقاومت در برابر رطوبت، چرخهٔ حرارتی، چسبندگی، دوام مکانیکی، مقاومت در برابر آلودگی، نمک‌پاشی و UV، عملکرد پس از غوطه‌وری و بررسی عدم اتصال‌کوتاه است. هم‌سو با IPC-CC-830 و IEC 61086، انتخاب ماده باید بر اساس نیاز واقعی هر کاربرد و در شرایط واقعی و قابل‌تکرار اعتبارسنجی شود، نه صرفاً تطابق عمومی با یک مشخصات.")],
"close":"پوشش‌های محافظ ابزاری کلیدی برای حفظ قابلیت اطمینان مدارهای الکترونیکی در محیط‌های سخت‌اند. یک پوشش نانوساختارِ پلاستیک‌پایه که بدون حرارت اجرا می‌شود، چندلایه ساخته می‌شود، پس از خشک‌شدن مقاوم است، در برابر آب و رطوبت محافظت می‌کند و غیرشفاف می‌ماند تا مهندسی معکوس را دشوار کند، یک راهکار صنعتیِ کاربردی برای حفاظت پیشرفته از بردهاست. در مقایسه با پوشش‌های رایج مانند اکریلیک، سیلیکون، پلی‌یورتان، اپوکسی و parylene، محصول MGCoat نه به‌عنوان یک فیلم عایق نازک، بلکه به‌عنوان یک لایهٔ محافظ پلاستیکیِ تقویت‌شده و بدون حرارت برای حفاظت توأمان محیطی و مکانیکی جایگاه‌گذاری می‌شود. برای تثبیت جایگاه صنعتی، انجام آزمون‌های عملکردی در چارچوب IPC و IEC و مستندسازی نتایج توصیه می‌شود."},
"ru":{"title":"Наноструктурное защитное покрытие для печатных плат и электроники: экологическая, механическая и водостойкая надёжность",
"desc":"Технический обзор наноструктурных защитных (конформных) покрытий для печатных плат и электронных схем: почему платы выходят из строя, оценочные рамки IPC-CC-830 и IEC 61086, и как покрытие на пластиковой основе без нагрева, наносимое слоями, защищает от воды, влаги, коррозии и механических нагрузок.",
"intro":"По мере распространения электроники в автомобильной, промышленной, морской, влажной и уличной средах защита печатных плат (PCB) от влаги, воды, загрязнений, коррозии, перепадов температуры и механических нагрузок стала ключевой задачей надёжности. Защитные покрытия, часто называемые конформными, — это проверенный способ продлить срок службы и надёжность электронных сборок. В статье рассматривается, почему важна защита, какими рамками она оценивается и как наноструктурное покрытие на пластиковой основе без нагрева отвечает этим требованиям.",
"secs":[("Почему платы выходят из строя в эксплуатации","Одна из главных причин отказов — проникновение влаги и ионных загрязнений на поверхность платы. Вместе они создают нежелательные проводящие пути, снижают поверхностное сопротивление изоляции, вызывают коррозию дорожек и нарушают работу схемы. Защитное покрытие образует барьер между платой и средой, уменьшая прямой контакт загрязнений и влаги с проводящими дорожками и компонентами."),
("Что делает защитное (конформное) покрытие","Конформное покрытие — это тонкий полимерный защитный слой, повторяющий контуры платы. Он защищает платы, компоненты и сборки от влаги, теплового удара, статики, вибрации и загрязнений, помогая сохранить диэлектрическую прочность, целостность работы и долговременную надёжность. В ответственных применениях цель — не только выдержать кратковременное попадание воды, но и сохранять стабильность схемы во времени при повторяющихся нагрузках."),
("Оценочные рамки: IPC-CC-830 и IEC 61086","Несколько международных стандартов определяют, как оценивать защитные покрытия. IPC-CC-830 задаёт требования к квалификации и соответствию для электроизоляционных составов, наносимых на печатные узлы, повышая доверие к характеристикам и сокращая лишние повторные испытания. IEC 61086 определяет, классифицирует и устанавливает требования к покрытиям для смонтированных печатных плат, включая общие, высоконадёжные и аэрокосмические применения. Эти рамки ясно показывают, что покрытие следует оценивать по измеренным характеристикам, таким как сопротивление изоляции, влага, термостабильность, адгезия, механическая стойкость и стойкость к загрязнениям, а не по общему заявлению о водостойкости."),
("Наноструктурное покрытие на пластиковой основе без нагрева","Рассматриваемое покрытие — это передовая защитная технология, формирующая прочный, непрозрачный слой на пластиковой основе на поверхности платы. В отличие от очень тонких плёнок, выполняющих в основном роль поверхностного изолятора, оно спроектировано как усиленный защитный слой, который можно наращивать в несколько проходов для увеличения толщины и защиты при сильной влаге, погружении, вибрации или загрязнении. Ключевая особенность — отсутствие нагрева: оно сохнет и образует защитный слой при комнатной температуре, не нагружая термочувствительные компоненты, пайки, разъёмы и точные модули."),
("Функциональные преимущества","Покрытие наносится окунанием, распылением или кистью, что подходит и для специализированного ремонта, и для промышленного применения. После отверждения оно приобретает заметную механическую стойкость, что важно там, где платы подвергаются обращению, вибрации, пыли или лёгким физическим нагрузкам. Его непрозрачность скрывает дорожки, компоненты и архитектуру платы от прямого обзора, действуя как визуальный барьер против обратного проектирования. Многослойное нанесение позволяет настраивать толщину и уровень защиты под каждое применение, а процесс без нагрева сохраняет совместимость с чувствительными сборками."),
("Промышленные применения","Покрытие подходит для широкого спектра задач: автомобильные ЭБУ, датчики, светодиодные модули, платы управления и электроника мотоциклов; промышленные платы управления, датчики среды и уличное оборудование; морская электроника, подверженная воде и влаге; дроны и FPV-системы под дождём, пылью и в меняющихся условиях. Особенно в светодиодных изделиях влага и загрязнения могут сокращать срок службы или вызывать короткие замыкания, поэтому подходящее защитное покрытие помогает сохранять долговременную стабильность."),
("Испытания и валидация","Хотя функциональная конструкция убедительна, профессиональный путь к промышленному внедрению — структурированные испытания и документированные результаты. Соответствующие тесты включают поверхностное сопротивление изоляции, стойкость к влаге, термоциклирование, адгезию, механическую долговечность, стойкость к загрязнениям, соляной туман и УФ, характеристики после погружения и проверку отсутствия коротких замыканий. В соответствии с IPC-CC-830 и IEC 61086 выбор материала следует основывать на реальных требованиях каждого применения и проверять в реалистичных, воспроизводимых условиях, а не только по общей спецификации.")],
"close":"Защитные покрытия — важный инструмент сохранения надёжности электроники в тяжёлых условиях. Наноструктурное покрытие на пластиковой основе, наносимое без нагрева, наращиваемое слоями, механически стойкое после отверждения, защищающее от воды и влаги и остающееся непрозрачным для затруднения обратного проектирования, — практичный промышленный путь к продвинутой защите плат. По сравнению с распространёнными покрытиями, такими как акрил, силикон, полиуретан, эпоксид и parylene, продукт MGCoat позиционируется не как тонкая изоляционная плёнка, а как усиленный защитный слой на пластиковой основе без нагрева для совместной экологической и механической защиты. Для закрепления позиции рекомендуется проводить испытания в рамках IPC и IEC и документировать результаты."},
"tr":{"title":"PCB ve Elektronik için Nanoyapılı Koruyucu Kaplama: Çevresel, Mekanik ve Su Geçirmez Güvenilirlik",
"desc":"PCB'ler ve elektronik devreler için nanoyapılı koruyucu (konformal) kaplamalara teknik bir bakış: kartlar neden arızalanır, IPC-CC-830 ve IEC 61086 değerlendirme çerçeveleri ve ısı gerektirmeyen, çok katmanlı, plastik esaslı bir kaplamanın suya, neme, korozyona ve mekanik gerilime karşı nasıl koruduğu.",
"intro":"Elektronik devreler otomotiv, endüstriyel, deniz, nemli ve dış mekân ortamlarına yayıldıkça, baskılı devre kartlarını (PCB) nemden, sudan, kirlilikten, korozyondan, sıcaklık değişimlerinden ve mekanik gerilimden korumak temel bir güvenilirlik sorunu hâline geldi. Çoğunlukla konformal kaplama olarak adlandırılan koruyucu kaplamalar, elektronik montajların ömrünü ve güvenilirliğini artırmanın köklü bir yoludur. Bu makale korumanın neden önemli olduğunu, hangi çerçevelerle değerlendirildiğini ve ısı gerektirmeyen, plastik esaslı nanoyapılı bir kaplamanın bu ihtiyaçlara nasıl uyduğunu inceler.",
"secs":[("Elektronik kartlar sahada neden arızalanır","Saha arızalarının başlıca nedenlerinden biri, nem ve iyonik kirliliğin kart yüzeyine girmesidir. Birlikte istenmeyen iletken yollar oluşturur, yüzey yalıtım direncini düşürür, metal yolları korozyona uğratır ve devrenin çalışmasını bozar. Koruyucu kaplama, kart ile ortam arasında bir bariyer oluşturarak kirlilik ve nemin iletken yollar ve bileşenlerle doğrudan temasını azaltır."),
("Koruyucu (konformal) kaplama ne yapar","Konformal kaplama, PCB'nin yüzeyine uyan ince bir polimer koruyucu katmandır. Kartları, bileşenleri ve montajları neme, termal şoka, statik elektriğe, titreşime ve kirliliğe karşı korur; dielektrik dayanımını, işlevsel bütünlüğü ve uzun ömürlü güvenilirliği korumaya yardımcı olur. Zorlu uygulamalarda amaç yalnızca kısa bir su temasına dayanmak değil, tekrarlanan çevresel gerilim altında devreyi zaman içinde kararlı tutmaktır."),
("Değerlendirme çerçeveleri: IPC-CC-830 ve IEC 61086","Birçok uluslararası standart koruyucu kaplamaların nasıl değerlendirileceğini tanımlar. IPC-CC-830, baskılı devre montajlarına uygulanan elektriksel yalıtım bileşikleri için yeterlilik ve uygunluk gereksinimlerini belirler; performansa güveni artırmayı ve gereksiz tekrar testlerini azaltmayı amaçlar. IEC 61086, monteli baskılı kartlarda kullanılan kaplamaları tanımlar, sınıflandırır ve gereksinimlerini genel, yüksek güvenilirlik ve havacılık kullanımları dâhil belirler. Bu çerçeveler, bir kaplamanın yalnızca genel bir su geçirmez iddiasıyla değil, yalıtım direnci, nem, termal kararlılık, yapışma, mekanik direnç ve kirliliğe direnç gibi ölçülen performansla değerlendirilmesi gerektiğini açıkça ortaya koyar."),
("Isı gerektirmeyen, plastik esaslı nanoyapılı kaplama","Burada ele alınan kaplama, kart yüzeyinde güçlü, opak, plastik esaslı bir katman oluşturan ileri bir koruma teknolojisidir. Esas olarak yüzey yalıtıcısı görevi gören çok ince filmlerin aksine, nem, daldırma, titreşim veya kirliliğin şiddetli olduğu yerlerde kalınlığı ve korumayı artırmak için birden çok katta uygulanabilen güçlendirilmiş bir koruyucu katman olarak tasarlanmıştır. Önemli bir pratik özellik ısı gerektirmemesidir: oda sıcaklığında kurur ve koruyucu katmanını oluşturur; bu da ısıya duyarlı bileşenleri, lehim bağlantılarını, konnektörleri ve hassas modülleri zorlamaktan kaçınır."),
("İşlevsel avantajlar","Kaplama daldırma, püskürtme veya fırça ile uygulanabilir; bu da onu hem uzman onarımı hem de endüstriyel kullanım için uygun kılar. Kürlendikten sonra, kartların ayrıca elleçleme, titreşim, toz veya hafif fiziksel gerilimle karşılaştığı yerlerde önemli olan kayda değer bir mekanik direnç kazanır. Opak yapısı; yolları, bileşenleri ve kart mimarisini doğrudan görüşten gizleyerek tersine mühendisliğe karşı görsel bir bariyer görevi görür. Çok katmanlı uygulama, kalınlığın ve koruma düzeyinin her uygulamaya göre ayarlanmasını sağlar; ısı gerektirmeyen süreç ise hassas montajlarla uyumlu kalmasını sağlar."),
("Endüstriyel uygulamalar","Kaplama geniş bir kullanım yelpazesine uygundur: otomotiv ECU'ları, sensörler, LED modülleri, kontrol kartları ve motosiklet elektroniği; endüstriyel kontrol kartları, çevre sensörleri ve dış mekân ekipmanları; suya ve neme maruz kalan deniz elektroniği; yağmur, toz ve değişken koşullarla karşılaşan drone ve FPV sistemleri. Özellikle LED ürünlerinde nem ve kirlilik ömrü kısaltabilir veya kısa devreye yol açabilir; uygun bir koruyucu kaplama uzun vadeli kararlılığı korumaya yardımcı olur."),
("Test ve doğrulama","İşlevsel tasarım ikna edici olsa da, endüstriyel kabule giden profesyonel yol yapılandırılmış testler ve belgelenmiş sonuçlardır. İlgili testler arasında yüzey yalıtım direnci, neme dayanım, termal çevrim, yapışma, mekanik dayanıklılık, kirliliğe direnç, tuz püskürtme ve UV direnci, daldırma sonrası performans ve kısa devre kontrolleri yer alır. IPC-CC-830 ve IEC 61086 ile tutarlı olarak, malzeme seçimi her uygulamanın gerçek gereksinimlerine dayanmalı ve yalnızca genel bir şartnameye göre değil, gerçekçi ve tekrarlanabilir koşullarda doğrulanmalıdır.")],
"close":"Koruyucu kaplamalar, elektroniği zorlu ortamlarda güvenilir tutmak için temel bir araçtır. Isı olmadan uygulanan, katmanlar hâlinde oluşturulan, kürlendikten sonra mekanik olarak dayanıklı, suya ve neme karşı koruyan ve tersine mühendisliği zorlaştırmak için opak kalan plastik esaslı nanoyapılı bir kaplama, ileri kart koruması için pratik bir endüstriyel yol sunar. Akrilik, silikon, poliüretan, epoksi ve parylene gibi yaygın kaplamalarla karşılaştırıldığında MGCoat ürünü ince bir yalıtım filmi olarak değil, çevresel ve mekanik korumayı birlikte sağlayan güçlendirilmiş, ısı gerektirmeyen plastik esaslı bir koruyucu katman olarak konumlanır. Konumunu pekiştirmek için IPC ve IEC çerçevelerinde performans testleri yapılması ve sonuçların belgelenmesi önerilir."},
"ar":{"title":"طلاء واقٍ نانوي البنية لـ PCB والإلكترونيات: موثوقية بيئية وميكانيكية ومقاومة للماء",
"desc":"نظرة تقنية على الطلاءات الواقية نانوية البنية (المطابقة) للوحات PCB والدوائر الإلكترونية: لماذا تتعطّل اللوحات، وأطر التقييم IPC-CC-830 وIEC 61086، وكيف يحمي طلاء قائم على البلاستيك بدون حرارة ومتعدد الطبقات من الماء والرطوبة والتآكل والإجهاد الميكانيكي.",
"intro":"مع انتشار الدوائر الإلكترونية في البيئات الصناعية والسياراتية والبحرية والرطبة والخارجية، أصبحت حماية لوحات الدوائر المطبوعة (PCB) من الرطوبة والماء والتلوّث والتآكل وتقلّبات الحرارة والإجهاد الميكانيكي تحدياً أساسياً للموثوقية. الطلاءات الواقية، التي تُسمى غالباً الطلاءات المطابقة، وسيلة راسخة لإطالة عمر المجموعات الإلكترونية وزيادة موثوقيتها. تستعرض هذه المقالة سبب أهمية الحماية، والأطر المستخدمة لتقييمها، وكيف يتوافق طلاء نانوي البنية قائم على البلاستيك وبدون حرارة مع هذه الاحتياجات.",
"secs":[("لماذا تتعطّل اللوحات في الميدان","من أبرز أسباب الأعطال الميدانية تسرّب الرطوبة والتلوّث الأيوني إلى سطح اللوحة. معاً يُكوّنان مسارات موصلة غير مرغوبة، ويخفضان مقاومة العزل السطحية، ويسبّبان تآكل المسارات المعدنية، ويعطّلان عمل الدائرة في النهاية. يُكوّن الطلاء الواقي حاجزاً بين اللوحة والبيئة، فيقلّل التلامس المباشر بين الملوّثات والرطوبة من جهة والمسارات الموصلة والمكوّنات من جهة أخرى."),
("ماذا يفعل الطلاء الواقي (المطابق)","الطلاء المطابق طبقة بوليمرية واقية رقيقة تتبع تضاريس اللوحة. يحمي اللوحات والمكوّنات والمجموعات من الرطوبة والصدمة الحرارية والكهرباء الساكنة والاهتزاز والتلوّث، ويساعد في الحفاظ على متانة العزل والسلامة الوظيفية والموثوقية طويلة الأمد. في التطبيقات الصعبة لا يكون الهدف مجرد تحمّل رشّة ماء عابرة، بل إبقاء الدائرة مستقرة مع الوقت تحت إجهاد بيئي متكرّر."),
("أطر التقييم: IPC-CC-830 وIEC 61086","تحدّد عدة معايير دولية كيفية تقييم الطلاءات الواقية. يحدّد IPC-CC-830 متطلبات التأهيل والمطابقة لمركّبات العزل الكهربائي المطبّقة على مجموعات الأسلاك المطبوعة، بهدف زيادة الثقة في الأداء وتقليل الاختبارات المتكررة غير الضرورية. ويُعرّف IEC 61086 الطلاءات المستخدمة على اللوحات المطبوعة المجهّزة ويصنّفها ويحدّد متطلباتها بما فيها الاستخدامات العامة وعالية الموثوقية والفضائية. توضّح هذه الأطر أن الطلاء يجب أن يُقيَّم بالأداء المقاس، مثل مقاومة العزل والرطوبة والاستقرار الحراري والالتصاق والمقاومة الميكانيكية ومقاومة التلوّث، لا بمجرد ادّعاء عام بأنه مقاوم للماء."),
("طلاء نانوي البنية قائم على البلاستيك وبدون حرارة","الطلاء محل النقاش تقنية حماية متقدّمة تُكوّن طبقة قوية غير شفافة قائمة على البلاستيك على سطح اللوحة. وخلافاً للأغشية الرقيقة جداً التي تعمل أساساً كعازل سطحي، صُمّم كطبقة واقية معزّزة يمكن بناؤها على عدة طبقات لزيادة السماكة والحماية حيث تشتدّ الرطوبة أو الغمر أو الاهتزاز أو التلوّث. من أهم ميزاته العملية أنه لا يحتاج إلى حرارة: يجف ويُكوّن طبقته الواقية في درجة حرارة الغرفة، ما يتجنّب إجهاد المكوّنات الحساسة للحرارة ونقاط اللحام والموصلات والوحدات الدقيقة."),
("المزايا الوظيفية","يمكن تطبيق الطلاء بالغمس أو الرش أو الفرشاة، ما يجعله مناسباً للإصلاح المتخصّص وللاستخدام الصناعي معاً. بعد الجفاف يكتسب مقاومة ميكانيكية ملحوظة، وهو أمر مهم حيث تتعرّض اللوحات أيضاً للمناولة والاهتزاز والغبار أو إجهاد فيزيائي خفيف. طبيعته غير الشفافة تُخفي المسارات والمكوّنات وبنية اللوحة عن الرؤية المباشرة، فيعمل كحاجز بصري ضد الهندسة العكسية. يتيح التطبيق متعدّد الطبقات ضبط السماكة ومستوى الحماية حسب كل تطبيق، وتبقيه العملية الخالية من الحرارة متوافقاً مع المجموعات الحساسة."),
("التطبيقات الصناعية","يناسب الطلاء مجموعة واسعة من الاستخدامات: وحدات ECU في السيارات، والحساسات، ووحدات LED، ولوحات التحكم، وإلكترونيات الدراجات النارية؛ ولوحات التحكم الصناعية، وحساسات البيئة، والمعدات الخارجية؛ والإلكترونيات البحرية المعرّضة للماء والرطوبة؛ والدرونات وأنظمة FPV التي تواجه المطر والغبار والظروف المتغيّرة. وفي منتجات LED خصوصاً، قد تقصّر الرطوبة والتلوّث العمر أو تسبّب قصراً، لذا يساعد الطلاء الواقي المناسب على الحفاظ على الاستقرار طويل الأمد."),
("الاختبار والتحقّق","رغم أن التصميم الوظيفي مقنع، فإن المسار المهني للاعتماد الصناعي هو اختبارات منظّمة ونتائج موثّقة. تشمل الاختبارات ذات الصلة مقاومة العزل السطحية، ومقاومة الرطوبة، والدورات الحرارية، والالتصاق، والمتانة الميكانيكية، ومقاومة التلوّث، والرذاذ الملحي والأشعة فوق البنفسجية، والأداء بعد الغمر، والتحقّق من عدم حدوث قصر. وانسجاماً مع IPC-CC-830 وIEC 61086، ينبغي أن يعتمد اختيار المادة على الاحتياجات الفعلية لكل تطبيق وأن يُتحقَّق منه في ظروف واقعية وقابلة للتكرار، لا بمجرد التطابق مع مواصفة عامة.")],
"close":"الطلاءات الواقية أداة أساسية للحفاظ على موثوقية الإلكترونيات في البيئات القاسية. إن طلاءً نانوي البنية قائماً على البلاستيك، يُطبَّق بدون حرارة، ويُبنى طبقات، ويقاوم ميكانيكياً بعد الجفاف، ويحمي من الماء والرطوبة، ويبقى غير شفاف ليُصعّب الهندسة العكسية، يقدّم مساراً صناعياً عملياً لحماية متقدّمة للوحات. ومقارنةً بالطلاءات الشائعة مثل الأكريليك والسيليكون والبولي يوريثان والإيبوكسي وparylene، يُوضَع منتج MGCoat لا كغشاء عزل رقيق، بل كطبقة واقية معزّزة قائمة على البلاستيك وبدون حرارة لحماية بيئية وميكانيكية معاً. ولترسيخ مكانته، يُوصى بإجراء اختبارات أداء ضمن أطر IPC وIEC وتوثيق النتائج."},
}}
A7={"slug":"pcb-coating-application-process-quality-control","kw":"PCB coating application, conformal coating process, masking PCB, coating defects, coating quality control, bubbles wicking delamination, coating inspection",
"L":{
"en":{"title":"Applying a Protective Coating to PCBs: Process, Quality Control and Defect Prevention",
"desc":"A practical engineering guide to applying conformal/protective coatings on PCBs: surface preparation, masking, dip/spray/brush technique, multi-pass build, curing, inspection and the common coating defects (bubbles, wicking, orange peel, delamination) and how to prevent them.",
"intro":"A protective coating only performs as well as the process used to apply it. Even an excellent material fails if the board is contaminated, the masking is wrong, or the film traps air or bridges connectors. This guide covers the practical process — preparation, masking, application, curing and inspection — and the common defects to avoid.",
"secs":[("Surface preparation and contamination control","Clean the board with isopropyl alcohol to remove flux residue, dust, oils and handling salts, then dry it fully. Contamination or trapped moisture under the film reduces adhesion and protection; on a clean, dry surface the coating bonds properly and performs to specification."),
("Masking: protect what must stay exposed","Connectors, gold fingers, test points, switches, heat-sink surfaces, sensors and grounding contacts must be masked before coating so they remain functional. Use masking tape, dots or peelable latex, and plan the keep-out areas before you start."),
("Choosing the application method","Dipping gives full, even coverage and suits batch work; spraying lays a uniform layer over larger boards; brushing is ideal for local reinforcement of edges, cable entries and repair zones. A heat-free, multi-method coating lets you match the technique to the job."),
("Multi-pass build and thickness control","Build the film in passes, allowing the initial dry (about 8–10 minutes) between coats. Two to four passes let you reach the target thickness and protection grade; thin, even layers avoid sags and trapped solvent better than one heavy coat."),
("Curing and handling","Allow full curing (about 12 hours for maximum mechanical strength) before stacking, packing or stressing the board. Cure at room temperature in a clean, dust-free area; premature handling can mar a soft film."),
("Inspection and acceptance","After coating, visually confirm complete, air-free coverage with no exposed traces and no bridging across masked areas. Because the layer is non-transparent, inspect under good light and from several angles; for critical work, verify function with a controlled powered test after full cure."),
("Common defects and how to prevent them","Bubbles and voids — apply thin passes and avoid shaking the liquid; wicking or capillary creep onto pads — mask precisely and do not over-apply at edges; orange peel — control distance and viscosity when spraying; delamination — clean and dry thoroughly before coating; edge or corner thinning — add a brushed reinforcement pass; cracking — avoid one excessively thick coat. Most defects trace back to cleanliness, layer thickness or curing.")],
"close":"Liquid PCB Plastic Coating by MG TECH is heat-free and can be applied by dipping, spraying or brushing, built up in 2–4 passes and inspected visually for air-free coverage — and it remains removable with a dedicated solvent for rework, making a clean, repeatable process straightforward in production or in the field."},
"fa":{"title":"اجرای پوشش محافظ روی PCB: فرآیند، کنترل کیفیت و پیشگیری از عیوب",
"desc":"راهنمای مهندسیِ کاربردی برای اجرای پوشش محافظ/Conformal روی PCB: آماده‌سازی سطح، ماسک‌کاری، تکنیک غوطه‌وری/اسپری/قلم‌مو، ساخت چندلایه، خشک‌شدن، بازرسی و عیوب رایج (حباب، wicking، پوست‌پرتقالی، لایه‌لایه‌شدن) و راه پیشگیری.",
"intro":"یک پوشش محافظ فقط به‌اندازهٔ فرآیند اجرایش خوب عمل می‌کند. حتی بهترین ماده هم اگر برد آلوده باشد، ماسک‌کاری اشتباه باشد یا فیلم هوا حبس کند یا روی کانکتور پل بزند، شکست می‌خورد. این راهنما فرآیند عملی — آماده‌سازی، ماسک، اجرا، خشک‌شدن و بازرسی — و عیوب رایجی که باید از آن‌ها پرهیز کرد را پوشش می‌دهد.",
"secs":[("آماده‌سازی سطح و کنترل آلودگی","برد را با الکل ایزوپروپیل تمیز کنید تا باقی‌ماندهٔ فلاکس، گردوغبار، چربی و نمکِ دست‌کاری برود، سپس کاملاً خشک کنید. آلودگی یا رطوبتِ گیرافتاده زیر فیلم، چسبندگی و حفاظت را کم می‌کند؛ روی سطحِ تمیز و خشک، پوشش درست می‌چسبد و طبق مشخصات عمل می‌کند."),
("ماسک‌کاری: آنچه باید باز بماند را محافظت کنید","کانکتورها، گلدفینگرها، نقاط تست، کلیدها، سطوح هیت‌سینک، سنسورها و کنتاکت‌های اتصال‌بدنه باید پیش از پوشش ماسک شوند تا کارا بمانند. از چسب ماسک، دات یا لاتکسِ قابل‌کندن استفاده کنید و نواحیِ ممنوعه را قبل از شروع مشخص کنید."),
("انتخاب روش اجرا","غوطه‌وری پوشش کامل و یکنواخت می‌دهد و برای کارِ دسته‌ای مناسب است؛ اسپری لایهٔ یکنواخت روی بردهای بزرگ‌تر؛ قلم‌مو برای تقویت موضعی لبه‌ها، ورودی کابل و نقاط تعمیر ایده‌آل است. یک پوششِ بدون حرارت و چندروشه اجازه می‌دهد تکنیک را با کار هماهنگ کنی."),
("ساخت چندلایه و کنترل ضخامت","فیلم را مرحله‌به‌مرحله بسازید و بین لایه‌ها به خشک‌شدن اولیه (حدود ۸ تا ۱۰ دقیقه) فرصت دهید. دو تا چهار مرحله به شما اجازه می‌دهد به ضخامت و گرید حفاظتیِ هدف برسید؛ لایه‌های نازک و یکنواخت بهتر از یک لایهٔ سنگین از شُره و حبسِ حلال جلوگیری می‌کنند."),
("خشک‌شدن و جابه‌جایی","پیش از روی‌هم‌گذاری، بسته‌بندی یا واردکردن تنش به برد، اجازهٔ خشک‌شدن کامل (حدود ۱۲ ساعت برای حداکثر استحکام مکانیکی) بدهید. در دمای محیط و در محیطی تمیز و بدون گردوغبار خشک کنید؛ جابه‌جاییِ زودهنگام می‌تواند فیلم نرم را خط بیندازد."),
("بازرسی و پذیرش","پس از پوشش، به‌صورت بصری پوشش کامل و بدون هوا را تأیید کنید؛ هیچ مسیر بازی نماند و روی نواحی ماسک‌شده پل نزند. چون لایه غیرشفاف است، زیر نور خوب و از چند زاویه بازرسی کنید؛ برای کارِ حساس، پس از خشک‌شدن کامل عملکرد را با یک تستِ کنترل‌شدهٔ روشن بررسی کنید."),
("عیوب رایج و راه پیشگیری","حباب و حفره — لایهٔ نازک بزنید و مادهٔ مایع را تکان ندهید؛ خزشِ مویینه (wicking) روی پدها — دقیق ماسک کنید و لبه‌ها را زیادی پوشش ندهید؛ پوست‌پرتقالی — هنگام اسپری فاصله و گرانروی را کنترل کنید؛ لایه‌لایه‌شدن — قبل از پوشش کاملاً تمیز و خشک کنید؛ نازکیِ لبه و گوشه — یک مرحلهٔ تقویتیِ قلم‌مو اضافه کنید؛ ترک — از یک لایهٔ بیش‌ازحد ضخیم پرهیز کنید. بیشتر عیوب به تمیزی، ضخامت لایه یا خشک‌شدن برمی‌گردند.")],
"close":"محصول Liquid PCB Plastic Coating شرکت MG TECH بدون حرارت است و با غوطه‌وری، اسپری یا قلم‌مو اجرا می‌شود، در ۲ تا ۴ مرحله ساخته می‌شود و از نظر پوششِ بدون هوا به‌صورت بصری بازرسی می‌شود — و برای تعمیر با حلال مخصوص قابل برداشتن است، که یک فرآیندِ تمیز و قابل‌تکرار را در تولید یا میدان ساده می‌کند."},
"ru":{"title":"Нанесение защитного покрытия на печатные платы: процесс, контроль качества и предотвращение дефектов",
"desc":"Практическое инженерное руководство по нанесению конформных/защитных покрытий на платы: подготовка поверхности, маскирование, техника окунания/распыления/кисти, многослойное нанесение, отверждение, контроль и распространённые дефекты (пузыри, затекание, апельсиновая корка, расслоение) и их предотвращение.",
"intro":"Защитное покрытие работает лишь настолько хорошо, насколько корректен процесс нанесения. Даже отличный материал откажет, если плата загрязнена, маскирование неверно, а плёнка захватывает воздух или перемыкает разъёмы. Это руководство охватывает практический процесс — подготовку, маскирование, нанесение, отверждение и контроль — и дефекты, которых следует избегать.",
"secs":[("Подготовка поверхности и контроль загрязнений","Очистите плату изопропиловым спиртом от остатков флюса, пыли, масел и солей и полностью высушите. Загрязнение или влага под плёнкой снижают адгезию и защиту; на чистой сухой поверхности покрытие правильно сцепляется и работает по спецификации."),
("Маскирование: защитите то, что должно остаться открытым","Разъёмы, краевые контакты, контрольные точки, переключатели, поверхности теплоотвода, датчики и точки массы нужно замаскировать до нанесения, чтобы они оставались рабочими. Используйте малярную ленту, точки или снимаемый латекс и спланируйте зоны до начала."),
("Выбор метода нанесения","Окунание даёт полное и ровное покрытие и подходит для партий; распыление кладёт ровный слой на крупные платы; кисть идеальна для локального усиления краёв, вводов кабеля и зон ремонта. Покрытие без нагрева с несколькими методами позволяет подобрать технику под задачу."),
("Многослойное нанесение и контроль толщины","Наращивайте плёнку проходами, давая первичную сушку (около 8–10 минут) между слоями. Два-четыре прохода позволяют достичь нужной толщины и степени защиты; тонкие ровные слои лучше предотвращают подтёки и захват растворителя, чем один толстый слой."),
("Отверждение и обращение","Дайте полностью отвердеть (около 12 часов для максимальной прочности) до укладки, упаковки или нагрузки платы. Отверждайте при комнатной температуре в чистом, беспыльном месте; преждевременное обращение может повредить мягкую плёнку."),
("Контроль и приёмка","После нанесения визуально подтвердите полное покрытие без воздуха, без открытых дорожек и перемычек по маскированным зонам. Так как слой непрозрачный, осматривайте при хорошем свете и с разных углов; для ответственных работ проверьте функцию контролируемым тестом под напряжением после полного отверждения."),
("Распространённые дефекты и их предотвращение","Пузыри и поры — наносите тонкими проходами и не взбалтывайте жидкость; затекание на площадки — точно маскируйте и не наносите лишнее у краёв; апельсиновая корка — контролируйте расстояние и вязкость при распылении; расслоение — тщательно очищайте и сушите перед нанесением; утончение на краях и углах — добавьте усиливающий проход кистью; растрескивание — избегайте одного чрезмерно толстого слоя. Большинство дефектов связаны с чистотой, толщиной слоя или отверждением.")],
"close":"Liquid PCB Plastic Coating от MG TECH наносится без нагрева окунанием, распылением или кистью, наращивается за 2–4 прохода и проверяется визуально на покрытие без воздуха — и остаётся снимаемым специальным растворителем для ремонта, делая чистый, воспроизводимый процесс простым в производстве и в поле."},
"tr":{"title":"PCB'ye Koruyucu Kaplama Uygulama: Süreç, Kalite Kontrol ve Kusur Önleme",
"desc":"PCB'lere konformal/koruyucu kaplama uygulamak için pratik mühendislik rehberi: yüzey hazırlığı, maskeleme, daldırma/püskürtme/fırça tekniği, çok katmanlı yapı, kürlenme, muayene ve yaygın kusurlar (kabarcık, kılcal yürüme, portakal kabuğu, delaminasyon) ve önlenmesi.",
"intro":"Bir koruyucu kaplama, ancak uygulandığı süreç kadar iyi çalışır. Kart kirliyse, maskeleme yanlışsa ya da film hava hapsediyor veya konnektörleri köprülüyorsa, en iyi malzeme bile başarısız olur. Bu rehber pratik süreci — hazırlık, maskeleme, uygulama, kürlenme ve muayene — ve kaçınılması gereken yaygın kusurları kapsar.",
"secs":[("Yüzey hazırlığı ve kirlilik kontrolü","Kartı izopropil alkolle temizleyerek flux kalıntısını, tozu, yağı ve tuzu giderin, sonra tamamen kurutun. Film altındaki kirlilik veya nem yapışmayı ve korumayı azaltır; temiz, kuru yüzeyde kaplama düzgün yapışır ve şartnameye göre çalışır."),
("Maskeleme: açık kalması gerekeni koruyun","Konnektörler, altın parmaklar, test noktaları, anahtarlar, ısı emici yüzeyler, sensörler ve toprak kontakları kaplamadan önce maskelenmeli, işlevsel kalmalıdır. Maskeleme bandı, nokta veya soyulabilir lateks kullanın ve yasak bölgeleri başlamadan planlayın."),
("Uygulama yöntemini seçme","Daldırma tam ve eşit kaplama verir, parti işine uygundur; püskürtme büyük kartlara düzgün katman koyar; fırça kenarların, kablo girişlerinin ve onarım bölgelerinin lokal güçlendirmesi için idealdir. Isısız, çok yöntemli bir kaplama tekniği işe göre seçmenizi sağlar."),
("Çok katmanlı yapı ve kalınlık kontrolü","Filmi katlar hâlinde oluşturun, katlar arası ilk kurumaya (yaklaşık 8–10 dk) izin verin. İki ila dört kat, hedef kalınlığa ve koruma kademesine ulaşmanızı sağlar; ince, düzgün katlar tek kalın kata göre akmayı ve çözücü hapsini daha iyi önler."),
("Kürlenme ve elleçleme","Kartı istiflemeden, paketlemeden veya zorlamadan önce tam kürlenmeye (maksimum mekanik dayanım için yaklaşık 12 saat) izin verin. Oda sıcaklığında, temiz ve tozsuz bir ortamda kürleyin; erken elleçleme yumuşak filmi bozabilir."),
("Muayene ve kabul","Kaplamadan sonra hava boşluğu olmadan tam kaplamayı, açık yol kalmadığını ve maskeli bölgelerde köprüleme olmadığını gözle doğrulayın. Katman opak olduğundan iyi ışıkta ve birkaç açıdan inceleyin; kritik işlerde tam kürlenme sonrası işlevi kontrollü enerjili testle doğrulayın."),
("Yaygın kusurlar ve önlenmesi","Kabarcık ve boşluk — ince katlar uygulayın ve sıvıyı çalkalamayın; kılcal yürüme (padlere) — hassas maskeleyin ve kenarlarda fazla uygulamayın; portakal kabuğu — püskürtürken mesafeyi ve viskoziteyi kontrol edin; delaminasyon — kaplamadan önce iyice temizleyip kurutun; kenar ve köşe incelmesi — fırçayla güçlendirme katı ekleyin; çatlama — tek aşırı kalın kattan kaçının. Çoğu kusur temizliğe, kat kalınlığına veya kürlenmeye dayanır.")],
"close":"MG TECH'in Liquid PCB Plastic Coating ürünü ısı gerektirmez; daldırma, püskürtme veya fırçayla uygulanır, 2–4 katta oluşturulur ve hava boşluğu olmadan kaplama açısından gözle muayene edilir — ve onarım için özel çözücüyle sökülebilir; bu da üretimde veya sahada temiz, tekrarlanabilir bir süreci kolaylaştırır."},
"ar":{"title":"تطبيق طلاء واقٍ على لوحات PCB: العملية وضبط الجودة ومنع العيوب",
"desc":"دليل هندسي عملي لتطبيق الطلاءات المطابقة/الواقية على لوحات PCB: تحضير السطح، الحجب، تقنية الغمس/الرش/الفرشاة، البناء متعدد الطبقات، الجفاف، الفحص والعيوب الشائعة (الفقاعات، الزحف الشعري، قشرة البرتقال، التقشّر) وكيفية منعها.",
"intro":"لا يعمل الطلاء الواقي إلا بقدر جودة عملية تطبيقه. حتى أفضل مادة تفشل إذا كانت اللوحة ملوّثة أو الحجب خاطئاً أو احتبس الهواء في الغشاء أو جسّر الموصلات. يغطّي هذا الدليل العملية العملية — التحضير والحجب والتطبيق والجفاف والفحص — والعيوب الشائعة التي يجب تجنّبها.",
"secs":[("تحضير السطح وضبط التلوّث","نظّف اللوحة بكحول الأيزوبروبيل لإزالة بقايا الفلَكس والغبار والزيوت والأملاح، ثم جفّفها تماماً. التلوّث أو الرطوبة تحت الغشاء يقلّلان الالتصاق والحماية؛ وعلى سطح نظيف وجاف يلتصق الطلاء جيداً ويعمل وفق المواصفات."),
("الحجب: احمِ ما يجب أن يبقى مكشوفاً","يجب حجب الموصلات وأطراف الذهب ونقاط الاختبار والمفاتيح وأسطح تبديد الحرارة والحساسات ونقاط التأريض قبل الطلاء لتبقى فعّالة. استخدم شريط الحجب أو النقاط أو اللاتكس القابل للنزع، وخطّط للمناطق الممنوعة قبل البدء."),
("اختيار طريقة التطبيق","الغمس يعطي تغطية كاملة ومتساوية ويناسب العمل بالدفعات؛ والرش يضع طبقة متساوية على اللوحات الأكبر؛ والفرشاة مثالية للتقوية الموضعية للحواف ومداخل الكابلات ومناطق الإصلاح. وطلاء بدون حرارة ومتعدد الطرق يتيح مطابقة التقنية للمهمة."),
("البناء متعدد الطبقات وضبط السماكة","ابنِ الغشاء على طبقات، مع ترك جفاف أولي (نحو 8–10 دقائق) بين الطبقات. تتيح طبقتان إلى أربع الوصول إلى السماكة ودرجة الحماية المستهدفة؛ والطبقات الرقيقة المتساوية تمنع السيلان واحتباس المذيب أفضل من طبقة واحدة سميكة."),
("الجفاف والمناولة","اترك الجفاف الكامل (نحو 12 ساعة لأقصى قوة ميكانيكية) قبل التكديس أو التغليف أو إجهاد اللوحة. جفّف في درجة حرارة الغرفة في مكان نظيف خالٍ من الغبار؛ فالمناولة المبكرة قد تخدش الغشاء الطري."),
("الفحص والقبول","بعد الطلاء، تأكّد بصرياً من التغطية الكاملة دون هواء، دون مسارات مكشوفة ودون تجسير على المناطق المحجوبة. ولأن الطبقة غير شفافة، افحص تحت إضاءة جيدة ومن عدة زوايا؛ وفي الأعمال الحرجة تحقّق من الأداء باختبار مضبوط تحت الطاقة بعد الجفاف الكامل."),
("العيوب الشائعة وكيفية منعها","الفقاعات والفراغات — طبّق طبقات رقيقة ولا ترُجّ السائل؛ الزحف الشعري إلى الأطراف — احجب بدقة ولا تُفرط عند الحواف؛ قشرة البرتقال — اضبط المسافة واللزوجة عند الرش؛ التقشّر — نظّف وجفّف جيداً قبل الطلاء؛ ترقّق الحواف والزوايا — أضف طبقة تقوية بالفرشاة؛ التشقّق — تجنّب طبقة واحدة مفرطة السماكة. معظم العيوب تعود إلى النظافة أو سماكة الطبقة أو الجفاف.")],
"close":"إن Liquid PCB Plastic Coating من MG TECH بدون حرارة، ويُطبَّق بالغمس أو الرش أو الفرشاة، ويُبنى في 2–4 طبقات ويُفحص بصرياً للتأكد من التغطية دون هواء — ويبقى قابلاً للإزالة بمذيب خاص للإصلاح، ما يجعل العملية النظيفة القابلة للتكرار سهلة في الإنتاج أو الميدان."},
}}
ARTICLES=[A1,A2,A3,A4,A5,A6,A7]

def header(active_back):
    return ('<header class="site-header"><div class="container nav">'
      '<a class="brand" href="/" aria-label="MG TECH — home"><picture><source srcset="/assets/img/logo-mark.webp" type="image/webp"/><img src="/assets/img/logo-mark.png" alt="MG TECH logo" width="40" height="40"/></picture><span class="brand-text">MG&nbsp;TECH<small>Electronic Circuit Waterproofing</small></span></a>'
      '<div class="lang-select"><button class="lang-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Select language"><span class="lt-flag">🇬🇧</span><span class="lt-name">English</span><span class="lt-chev">▾</span></button>'
      '<div class="lang-menu" role="listbox">'+''.join(f'<button class="lang-btn" type="button" data-lang="{l}"><span>{LBL[l][0]}</span><span>{LBL[l][1]}</span></button>' for l in LANGS)+'</div></div>'
      '</div></header>')

BLOGJS='''<script src="/assets/js/blog.js"></script>'''

def article_page(a):
    posts=""
    lds=[]
    for l in LANGS:
        d=a["L"][l]; dirv="rtl" if l in RTL else "ltr"
        body="".join(f"<h2>{html.escape(h)}</h2><p>{html.escape(p)}</p>" for h,p in d["secs"])
        posts+=(f'<article class="post" data-lang="{l}" lang="{l}" dir="{dirv}" hidden>'
                f'<nav class="crumbs"><a href="/">{HOME[l]}</a> / <a href="/blog/">{BLOGW[l]}</a></nav>'
                f'<h1>{html.escape(d["title"])}</h1><p class="article-meta">MG TECH · {DATE}</p>'
                f'<p class="lead-p">{html.escape(d["intro"])}</p>{body}<p>{html.escape(d["close"])}</p>'
                f'<div class="article-cta"><a class="btn red" href="{WA}" rel="noopener" target="_blank">{CTA[l]}</a> <a class="btn" href="/blog/">{MORE[l]}</a></div></article>')
        lds.append({"@type":"Article","headline":d["title"],"description":d["desc"],"inLanguage":l,"datePublished":DATE,"dateModified":DATE,"author":{"@type":"Organization","name":"MG TECH"},"publisher":{"@type":"Organization","name":"MG TECH","logo":{"@type":"ImageObject","url":SITE+"/assets/img/logo-mark.png"}},"mainEntityOfPage":f"{SITE}/blog/{a['slug']}.html","image":SITE+"/assets/img/og-banner.jpg"})
    en=a["L"]["en"]
    return f"""<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>{html.escape(en['title'])} | MG TECH</title>
<meta name="description" content="{html.escape(en['desc'])}"/>
<meta name="keywords" content="{html.escape(a['kw'])}"/>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="{SITE}/blog/{a['slug']}.html"/>
<meta property="og:type" content="article"/><meta property="og:title" content="{html.escape(en['title'])}"/>
<meta property="og:description" content="{html.escape(en['desc'])}"/><meta property="og:url" content="{SITE}/blog/{a['slug']}.html"/>
<meta property="og:image" content="{SITE}/assets/img/og-banner.jpg"/><meta name="theme-color" content="#070910"/>
<link rel="icon" href="/favicon.ico" sizes="any"/><link rel="icon" type="image/png" sizes="48x48" href="/assets/img/favicon-48.png"/>
{FONTS}
<link rel="stylesheet" href="/assets/css/style.css?v=202606041b"/>
<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@graph":lds},ensure_ascii=False,separators=(',',':'))}</script>
</head>
<body>
{header(True)}
<main class="article"><div class="container prose">
{posts}
</div></main>
<footer>© M.Ghanbari — MG TECH · Liquid PCB Plastic Coating. <a href="/">mgcoat.com</a></footer>
{BLOGJS}
</body></html>"""

for a in ARTICLES:
    open(f"blog/{a['slug']}.html","w",encoding='utf-8').write(article_page(a))
    print("wrote blog/"+a['slug']+".html")

# index
posts=""
for l in LANGS:
    dirv="rtl" if l in RTL else "ltr"
    cards="".join(f'<a class="blog-card" href="/blog/{a["slug"]}.html"><h2>{html.escape(a["L"][l]["title"])}</h2><p>{html.escape(a["L"][l]["desc"])}</p><span class="blog-more">{READ[l]} →</span></a>' for a in ARTICLES)
    posts+=(f'<div class="post" data-lang="{l}" lang="{l}" dir="{dirv}" hidden>'
            f'<h1>{html.escape(BLOGTITLE[l])}</h1><p class="lead-p">{html.escape(BLOGLEAD[l])}</p>'
            f'<div class="blog-grid">{cards}</div></div>')
idx=f"""<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Blog — PCB Waterproofing & Protective Coating | MG TECH</title>
<meta name="description" content="Guides on waterproofing PCBs, conformal vs plastic coatings and protecting electronics — in English, Russian, Turkish, Arabic and Persian."/>
<meta name="robots" content="index, follow"/>
<link rel="canonical" href="{SITE}/blog/"/>
<meta property="og:type" content="website"/><meta property="og:title" content="MG TECH Blog"/>
<meta property="og:image" content="{SITE}/assets/img/og-banner.jpg"/><meta name="theme-color" content="#070910"/>
<link rel="icon" href="/favicon.ico" sizes="any"/><link rel="icon" type="image/png" sizes="48x48" href="/assets/img/favicon-48.png"/>
{FONTS}
<link rel="stylesheet" href="/assets/css/style.css?v=202606041b"/>
</head>
<body>
{header(True)}
<main class="article"><div class="container prose">
{posts}
</div></main>
<footer>© M.Ghanbari — MG TECH · Liquid PCB Plastic Coating. <a href="/">mgcoat.com</a></footer>
{BLOGJS}
</body></html>"""
open("blog/index.html","w",encoding='utf-8').write(idx)
print("wrote blog/index.html")
