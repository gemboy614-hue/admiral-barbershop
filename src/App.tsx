import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, MessageCircle, ArrowRight, X, Star, Send } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Lenis from 'lenis';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Page = 'home' | 'services' | 'masters';

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

const REVIEWS = [
  { name: 'Даниил Евтушенко', text: 'Классное место, Кристина просто Ювелир', rate: 5 },
  { name: 'Илья Киров', text: 'Бек красавчик, знает свое дело. Рекомендую.', rate: 5 },
  { name: 'Сергей Юриков', text: 'Для меня Мирон лучший, каждое посещение это праздник эмоций.', rate: 5 },
  { name: 'Андрей Хаванский', text: 'Отличный барбер шоп, классный дизайн.', rate: 5 },
  { name: 'Владислав Кузин', text: 'Мирон, я твои руки целовал. ЭТО ЧТО ЗА МАСТЕР!!!!', rate: 5 },
  { name: 'Ярослав Мудрый', text: 'Подстригут, намоют, выбреют на высшем уровне.', rate: 5 }
];

const MASTERS = [
  {
    id: 'abdullah',
    name: 'Абдуллах',
    title: 'PRO BARBER',
    reviewsCount: 21,
    reviews: [
      { name: 'Илья', date: '16 мая 2026', text: 'Часто подстригаюсь здесь, и с каждым разом всё больше доволен, всегда подскажут как лучше и подберут отличный стиль для каждого, Спасибо большое' },
      { name: 'Сергей', date: '12 мая 2026', text: 'Стригусь не первый раз, всегда класно, так держать' },
      { name: 'Макар', date: '11 мая 2026', text: 'Честно не понравилось' },
      { name: 'Юрий', date: '6 мая 2026', text: 'Всё отлично, предложили что-то новое, давно хотел попробовать' },
      { name: 'Тимур', date: '5 мая 2026', text: 'Отличный мастер Абдуллах! Очень отзывчивый специалист и умеет ладить с детьми. Сын стригся спокойно и в удовольствии, результат прекрасный. Спасибо за подход и качество!' },
      { name: 'Николай', date: '28 апреля 2026', text: 'Отличный мастер, в работе выкладывается на 200%, всем советую только его 👍' },
      { name: 'Илья', date: '22 апреля 2026', text: 'Отличный мастер. Помог подобрать прическу и объяснил все нюансы. Рекомендую' },
      { name: 'Илья', date: '15 апреля 2026', text: 'Прекрасный специалист' },
    ]
  },
  {
    id: 'miron',
    name: 'Мирон',
    title: 'PRO BARBER',
    reviewsCount: 262,
    reviews: [
      { name: 'Сергей', date: '17 мая 2026', text: 'Мирон, это специалист который может решить все ваши проблемы, касательно волос, для меня он лучший.' },
      { name: 'Виталий', date: '24 апреля 2026', text: 'Супер мастер 🤝' },
      { name: 'Максим', date: '27 марта 2026', text: 'Все отлично, лучший мастер' },
      { name: 'Александр', date: '6 января 2026', text: 'Самый лучший! Приятное общение, и самое главное классная стрижка! Обязательно приду еще!' },
      { name: 'Андрей', date: '23 декабря 2025', text: 'Лучший в своём деле' },
      { name: 'Олег Клевцов', date: '29 ноября 2025', text: 'Как всегда по красоте 🤘' },
      { name: 'Владимир', date: '25 ноября 2025', text: 'Наконец-то, достойный барбер, работой очень доволен, не прикопаться 🫣 Даже шапка не испортила укладку 🤣' },
      { name: 'Артем', date: '22 ноября 2025', text: 'Супер специалист и хороший человек, так держать 💪💪💪' },
    ]
  },
  {
    id: 'kristina',
    name: 'Кристина',
    title: 'PRO BARBER',
    reviewsCount: 221,
    reviews: [
      { name: 'Владислав', date: '11 мая 2026', text: 'Все замечательно.' },
      { name: 'Федор', date: '3 мая 2026', text: 'Барбер, Кристина мастер своего дела, очень приятно ходить именно к ней, всем советую' },
      { name: 'Анатолий', date: '24 апреля 2026', text: 'Все отлично. 👌' },
      { name: 'Виталий', date: '24 апреля 2026', text: 'Кристина красотка умница рекомендую Супер специалист' },
      { name: 'Федор', date: '30 марта 2026', text: 'Кристина великолепный барбер, каждое посещение проходит превосходно 👍' },
      { name: 'Ярослав', date: '9 марта 2026', text: 'Мастер Кристина великолепный мастер, очень качественно подстригла, пообщались' },
    ]
  }
];

const DETAILED_SERVICES = [
  {
    name: 'Мужская стрижка',
    time: '1 ч',
    price: '2 200 ₽',
    desc: 'Классическая или современная форма, подчеркивающая ваши черты. Включает мытье головы, укладку и подбор средств.',
    img: '/admiral-haircut.jpg'
  },
  {
    name: 'Стрижка машинкой, 1 насадка',
    time: '1 ч',
    price: '1 400 ₽',
    desc: 'Равномерная длина и идеальные контуры. Быстро, стильно и аккуратно.',
    img: '/admiral-machine-cut.jpg'
  },
  {
    name: 'Моделирование бороды / бритье',
    time: '1 ч',
    price: '1 700 ₽',
    desc: 'Ровные контуры, распаривание, бритье опасной бритвой с использованием итальянской косметики.',
    img: '/admiral-beard.jpg'
  },
  {
    name: 'Камуфляж седины (борода)',
    time: '1 ч',
    price: '1 500 ₽',
    desc: 'Естественное тонирование седины на бороде с мягким переходом.',
    img: 'https://images.unsplash.com/photo-1539063955936-cf9760e4ed30?q=80&w=2670&auto=format&fit=crop'
  },
  {
    name: 'Камуфляж седины (голова)',
    time: '1 ч',
    price: '1 700 ₽',
    desc: 'Скрытие седых волос, быстрое достижение ровного и натурального оттенка.',
    img: 'https://images.unsplash.com/photo-1634449571017-5fecfd26ad76?q=80&w=2670&auto=format&fit=crop'
  },
  {
    name: 'Коррекция воском',
    time: '15 мин',
    price: '900 ₽',
    desc: 'Удаление нежелательных волос (нос, уши, брови) теплым воском.',
    img: 'https://images.unsplash.com/photo-1570554520913-ce2192a74574?q=80&w=2670&auto=format&fit=crop'
  },
  {
    name: 'Черная маска',
    time: '30 мин',
    price: '1 300 ₽',
    desc: 'Глубокое очищение пор, удаление черных точек и обновление кожи лица.',
    img: 'https://images.unsplash.com/photo-1590322739578-fb3d9ff41465?q=80&w=2670&auto=format&fit=crop'
  },
  {
    name: 'Массаж лица',
    time: '30 мин',
    price: '800 ₽',
    desc: 'Расслабляющий массаж, снятие напряжения и улучшение кровотока.',
    img: 'https://images.unsplash.com/photo-1712725213051-8d7d6a52edaf?q=80&w=2670&auto=format&fit=crop'
  },
  {
    name: 'Патчи',
    time: '15 мин',
    price: '500 ₽',
    desc: 'Освежающие патчи: снятие отечности и усталости, увлажнение зоны вокруг глаз.',
    img: 'https://images.unsplash.com/photo-1542848284-8afa78a08ccb?q=80&w=2670&auto=format&fit=crop'
  },
  {
    name: 'Премиум моделирование бороды / бритье',
    time: '1 ч',
    price: '2 600 ₽',
    desc: 'Ритуал с использованием люксовой косметики, горячие и холодные компрессы, глубокое увлажнение.',
    img: 'https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=2670&auto=format&fit=crop'
  },
  {
    name: 'Премиум уход за лицом',
    time: '1 ч',
    price: '1 600 ₽',
    desc: 'Комплексное очищение, черная маска, освежающие патчи и расслабляющий массаж.',
    img: '/admiral-premium-face.jpg'
  },
  {
    name: 'Стрижка ножницами',
    time: '1 ч 30 мин',
    price: '3 000 ₽',
    desc: 'Исключительно ручная работа ножницами для создания безупречной фактуры и естественного падения волос.',
    img: 'https://images.unsplash.com/photo-1553521041-d168abd31de3?q=80&w=2670&auto=format&fit=crop'
  },
  {
    name: 'Премиум уход за кожей головы',
    time: '1 ч',
    price: '1 500 ₽',
    desc: 'Деликатный пилинг, глубокое очищение и питание луковиц волос специальными составами.',
    img: 'https://images.unsplash.com/photo-1717160675489-7779f2c91999?q=80&w=2670&auto=format&fit=crop'
  },
  {
    name: 'Детская стрижка',
    time: '1 ч',
    price: '1 300 ₽',
    desc: 'Стильная стрижка для юных джентльменов. Наши мастера найдут подход к любому ребенку.',
    img: 'https://images.unsplash.com/photo-1704072650662-76df3af134a7?q=80&w=2670&auto=format&fit=crop'
  }
];

const BOOKING_URL = "https://n1248391.yclients.com/";

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

const FadeIn = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.9, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[100] flex justify-end bg-black/70 backdrop-blur-sm"
        >
          <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
          <motion.div
             initial={{ x: '100%' }}
             animate={{ x: 0 }}
             exit={{ x: '100%' }}
             transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
             className="w-full md:w-[480px] h-full bg-[#030303] border-l border-white/10 relative flex flex-col shadow-2xl"
          >
             <button
               onClick={onClose}
               className="absolute -left-16 top-6 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition hidden md:block"
             >
               <X className="w-6 h-6"/>
             </button>
             <button
               onClick={onClose}
               className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-full text-white z-10 md:hidden"
             >
               <X className="w-5 h-5"/>
             </button>
             <div className="w-full h-full bg-white relative overflow-hidden">
                <iframe src={BOOKING_URL} className="w-full h-full border-0 absolute inset-0" title="Онлайн запись" />
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ page, setPage, onBook }: { page: Page, setPage: (p: Page) => void, onBook: () => void }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 transition-all duration-500",
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-4" : "bg-transparent"
      )}
    >
      <div
        className="text-xl md:text-2xl font-serif font-bold tracking-widest uppercase select-none cursor-pointer"
        onClick={() => setPage('home')}
      >
        Адмирал
      </div>

      <div className="flex items-center gap-6 md:gap-10 text-sm tracking-widest uppercase font-medium">
        <button
          onClick={() => setPage('services')}
          className={cn("hidden md:block transition-colors", page === 'services' ? "text-white" : "text-white/50 hover:text-white")}
        >
          Услуги
        </button>
        <button
          onClick={() => setPage('masters')}
          className={cn("hidden md:block transition-colors", page === 'masters' ? "text-white" : "text-white/50 hover:text-white")}
        >
          Мастера
        </button>
        <button
          onClick={onBook}
          className="group relative px-6 py-3 overflow-hidden bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors"
        >
          Онлайн-запись
        </button>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[#030303] z-10 pointer-events-none" />
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2674&auto=format&fit=crop"
          alt="Atmosphere"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-[8rem] lg:text-[11rem] font-serif font-bold tracking-tighter uppercase leading-none drop-shadow-2xl">
            Адмирал
          </h1>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
           className="mt-8 flex flex-col items-center gap-6"
        >
          <div className="h-[1px] w-12 bg-white/50" />
          <p className="text-xl md:text-2xl font-light tracking-widest text-white/90 uppercase">
            Создаем стиль. Дарим эмоции.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const MainInfo = ({ onBook, setPage }: { onBook: () => void, setPage: (p: Page) => void }) => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">

        <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 lg:pr-8">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-10 uppercase tracking-tight">Ждем в гости</h2>
          </FadeIn>

          <div className="flex flex-col gap-8 font-light text-lg">
            <FadeIn delay={0.1} className="flex gap-5">
               <MapPin className="w-7 h-7 text-white/40 shrink-0 mt-1" />
               <div>
                  <p className="text-white/90 text-2xl font-serif mb-1">ул. Адмирала Фокина, 23в</p>
                  <p className="text-white/50 text-base leading-relaxed">Цокольный этаж<br/>Фрунзенский район, Владивосток, 690091</p>
                  <div className="flex gap-3 mt-3 text-xs font-medium tracking-widest uppercase text-white/40">
                     <span>9 мин / 800 м</span>
                     <span className="w-1 h-1 rounded-full bg-white/20 self-center" />
                     <span>18 парковок</span>
                  </div>
               </div>
            </FadeIn>

            <FadeIn delay={0.2} className="flex gap-5">
               <Star className="w-7 h-7 text-yellow-500/80 shrink-0 mt-1" />
               <div>
                  <p className="text-white/90 text-2xl font-serif mb-1">4.9 Рейтинг</p>
                  <p className="text-white/50 text-base">Высшая оценка на основе 351 отзыва</p>
               </div>
            </FadeIn>

            <FadeIn delay={0.3} className="flex gap-5">
               <Phone className="w-7 h-7 text-white/40 shrink-0 mt-1" />
               <div>
                  <p className="text-white/90 text-2xl font-serif mb-1">+7 953 208-24-44</p>
                  <p className="text-white/50 text-base">Ежедневно, 10:00–21:00</p>
               </div>
            </FadeIn>

            <FadeIn delay={0.4} className="mt-6 flex flex-col sm:flex-row gap-4">
               <button
                 onClick={onBook}
                 className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors uppercase tracking-widest text-sm text-center"
               >
                 Онлайн-запись
               </button>
               <button
                 onClick={() => setPage('services')}
                 className="px-8 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors uppercase tracking-widest text-sm text-center"
               >
                 Все услуги
               </button>
            </FadeIn>

            <FadeIn delay={0.5} className="flex items-center gap-4 mt-2">
               <a
                 href="https://api.whatsapp.com/send/?phone=79532082444&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%0A%0A%D0%9F%D0%B8%D1%88%D1%83+%D0%B8%D0%B7+%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F+2%D0%93%D0%98%D0%A1.%0A%0A&type=phone_number&app_absent=0"
                 target="_blank"
                 rel="noreferrer"
                 className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white"
                 title="WhatsApp"
               >
                 <MessageCircle className="w-5 h-5" />
               </a>
               <a
                 href="https://t.me/+79532082444"
                 target="_blank"
                 rel="noreferrer"
                 className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white"
                 title="Telegram"
               >
                 <Send className="w-5 h-5 -ml-1 cursor-pointer" />
               </a>
            </FadeIn>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-4 order-1 lg:order-2 h-full lg:min-h-[600px]">
           <FadeIn delay={0.1} className="col-span-2 md:col-span-2 group overflow-hidden rounded-2xl aspect-[4/3] md:aspect-auto bg-neutral-900 border border-white/5">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img src="/2026-05-29_09-57-48.png" alt="Инструменты" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out" />
           </FadeIn>
           <FadeIn delay={0.2} className="col-span-1 group overflow-hidden rounded-2xl aspect-square md:aspect-auto bg-neutral-900 border border-white/5">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700 z-10" />
              <img src="/2026-05-29_09-57-36.png" alt="PS5" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out" />
           </FadeIn>

           <FadeIn delay={0.3} className="col-span-1 group overflow-hidden rounded-2xl aspect-square bg-neutral-900 border border-white/5">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img src="/2026-05-29_09-57-56.png" alt="Proraso" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out" />
           </FadeIn>
           <FadeIn delay={0.4} className="col-span-1 group overflow-hidden rounded-2xl aspect-square bg-neutral-900 border border-white/5">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img src="/2026-05-29_09-58-02.png" alt="Crew" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out" />
           </FadeIn>
           <FadeIn delay={0.5} className="col-span-2 md:col-span-1 group overflow-hidden rounded-2xl aspect-[2/1] md:aspect-square bg-neutral-900 border border-white/5">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img src="/2026-05-29_09-58-08.png" alt="Luxina" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out object-center" />
           </FadeIn>
        </div>
      </div>
    </section>
  );
};

const MastersSection = ({ setPage }: { setPage: (p: Page) => void }) => (
  <section className="mt-32 px-6 md:px-12 max-w-7xl mx-auto">
    <div className="border-t border-white/5 pt-24">
      <FadeIn>
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight">Наши мастера</h2>
          <div className="flex-1 h-[1px] bg-white/20 mt-1" />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MASTERS.map((master, idx) => (
          <FadeIn key={master.id} delay={idx * 0.15}>
            <div
              className="group flex flex-col items-center text-center p-10 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all duration-500 cursor-pointer"
              onClick={() => setPage('masters')}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center text-3xl font-serif font-bold mb-5 border border-white/10 group-hover:border-white/20 transition-colors">
                {master.name[0]}
              </div>
              <h3 className="text-2xl font-serif font-bold mb-1">{master.name}</h3>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">{master.title}</p>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-current text-yellow-500/80" />
                <span className="text-white/60 text-sm">{master.reviewsCount} отзывов</span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.5} className="mt-10 flex justify-center">
        <button
          onClick={() => setPage('masters')}
          className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors"
        >
          Все мастера <ArrowRight className="w-4 h-4" />
        </button>
      </FadeIn>
    </div>
  </section>
);

const FAQ_ITEMS = [
  {
    q: "График работы?",
    a: "Мы открыты ежедневно с 10:00 до 21:00 без перерывов и выходных. Ждем вас в любое удобное время, но рекомендуем записываться заранее."
  },
  {
    q: "Есть ли оплата картами?",
    a: "Да, мы принимаем оплату наличными, а также любыми банковскими картами РФ, переводами и по QR-коду."
  },
  {
    q: "Как записаться?",
    a: "Самый быстрый способ — воспользоваться кнопкой «Онлайн-запись» на нашем сайте. Также записаться можно, написав нам в WhatsApp, Telegram, или позвонив по номеру."
  },
  {
    q: "Есть ли у вас парковка?",
    a: "Да, рядом расположено 18 парковочных мест, вы сможете легко и удобно припарковаться."
  }
];

const ReviewsCarousel = () => {
   return (
      <section className="mt-32 max-w-[100vw] overflow-hidden flex flex-col items-center">
         <FadeIn>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-12 uppercase tracking-tight text-center">Отзывы</h2>
         </FadeIn>

         <div className="relative w-full flex overflow-hidden group py-4">
            <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none" />

            <motion.div
               className="flex gap-6 w-max"
               animate={{ x: ["0%", "-50%"] }}
               transition={{ ease: "linear", duration: 35, repeat: Infinity, repeatType: "loop" }}
            >
               {REVIEWS.concat(REVIEWS).map((review, idx) => (
                  <div key={idx} className="w-[320px] md:w-[420px] bg-white/[0.02] border border-white/5 p-8 rounded-2xl flex flex-col justify-between shrink-0">
                     <p className="text-white/70 font-light text-lg mb-8 leading-relaxed">"{review.text}"</p>
                     <div>
                        <p className="text-white font-medium mb-2">{review.name}</p>
                        <div className="flex gap-1 text-yellow-500/80">
                           {Array.from({ length: review.rate }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                           ))}
                        </div>
                     </div>
                  </div>
               ))}
            </motion.div>
         </div>
      </section>
   )
}

const FAQ = () => {
   const [openIndex, setOpenIndex] = useState<number | null>(0);

   const toggle = (i: number) => {
     setOpenIndex(openIndex === i ? null : i);
   }

   return (
     <section className="mt-32 max-w-4xl mx-auto">
        <FadeIn>
           <h2 className="text-3xl md:text-5xl font-serif font-bold mb-12 uppercase tracking-tight text-center">Частые вопросы</h2>
        </FadeIn>
        <div className="flex flex-col gap-4">
           {FAQ_ITEMS.map((item, idx) => (
             <FadeIn key={idx} delay={idx * 0.1}>
                <div
                  className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => toggle(idx)}
                >
                   <div className="px-6 py-6 flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                      <h4 className="text-lg md:text-xl font-medium tracking-wide pr-6">{item.q}</h4>
                      <div className={cn("shrink-0 transition-transform duration-300", openIndex === idx ? "rotate-45 text-white" : "rotate-0 text-white/40")}>
                         <div className="relative w-5 h-5">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-current" />
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-current" />
                         </div>
                      </div>
                   </div>
                   <AnimatePresence>
                      {openIndex === idx && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="px-6 pb-6 text-white/50 font-light leading-relaxed text-base"
                         >
                            {item.a}
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </FadeIn>
           ))}
        </div>
     </section>
   )
}

const ServicesPage = ({ onBook }: { onBook: () => void }) => {
  return (
    <div className="pt-40 pb-32 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <FadeIn>
         <div className="flex items-center gap-6 mb-16">
           <h1 className="text-5xl md:text-7xl font-serif font-bold uppercase tracking-tight">Услуги</h1>
           <div className="flex-1 h-[1px] bg-white/20 mt-4" />
         </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-24">
         {DETAILED_SERVICES.map((srv, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
               <div className="flex flex-col group cursor-pointer" onClick={onBook}>
                 <div className="w-full aspect-[4/5] overflow-hidden rounded-2xl mb-8 relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700 z-10" />
                    <img
                       src={srv.img}
                       alt={srv.name}
                       className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
                    />
                 </div>
                 <div className="flex justify-between items-start mb-4 gap-4">
                   <h3 className="text-2xl md:text-3xl font-serif font-bold group-hover:text-white/80 transition-colors uppercase leading-tight">{srv.name}</h3>
                   <div className="text-right">
                     <span className="block text-xl md:text-2xl font-light whitespace-nowrap mt-1">{srv.price}</span>
                     <span className="text-white/40 text-sm">{srv.time}</span>
                   </div>
                 </div>
                 <p className="text-white/50 font-light leading-relaxed mb-8 text-lg">{srv.desc}</p>
                 <button className="flex items-center text-sm font-bold tracking-widest uppercase text-white group-hover:text-white/60 transition-colors w-fit">
                    Записаться <ArrowRight className="w-5 h-5 ml-3" />
                 </button>
               </div>
            </FadeIn>
         ))}
      </div>
    </div>
  );
}

const MastersPage = ({ onBook }: { onBook: () => void }) => {
  return (
    <div className="pt-40 pb-32 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <FadeIn>
        <div className="flex items-center gap-6 mb-16">
          <h1 className="text-5xl md:text-7xl font-serif font-bold uppercase tracking-tight">Мастера</h1>
          <div className="flex-1 h-[1px] bg-white/20 mt-4" />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {MASTERS.map((master, idx) => (
          <FadeIn key={master.id} delay={idx * 0.15}>
            <div className="flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden h-full">

              <div className="flex flex-col items-center text-center p-10 border-b border-white/5">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-4xl font-serif font-bold mb-5 border border-white/10">
                  {master.name[0]}
                </div>
                <h2 className="text-3xl font-serif font-bold mb-1">{master.name}</h2>
                <p className="text-white/40 text-xs tracking-widest uppercase mb-4">{master.title}</p>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-4 h-4 fill-current text-yellow-500/80" />
                  <span className="text-white/60 text-sm">{master.reviewsCount} отзывов</span>
                </div>
                <button
                  onClick={onBook}
                  className="px-7 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors uppercase tracking-widest text-xs"
                >
                  Записаться
                </button>
              </div>

              <div className="flex flex-col flex-1 divide-y divide-white/5">
                {master.reviews.map((review, rIdx) => (
                  <div key={rIdx} className="px-8 py-5">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="font-medium text-sm">{review.name}</span>
                      <span className="text-white/30 text-xs shrink-0 ml-3">{review.date}</span>
                    </div>
                    <p className="text-white/50 font-light text-sm leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>

              <div className="px-8 py-6 border-t border-white/5">
                <button
                  onClick={onBook}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-white/10 rounded-xl text-white/50 hover:text-white hover:border-white/30 transition-all duration-300 text-xs font-bold tracking-widest uppercase"
                >
                  Все отзывы <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

const Footer = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <footer className="relative py-24 md:py-32 px-6 md:px-12 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">

        <div className="max-w-sm">
          <h2 className="text-3xl font-serif font-bold uppercase mb-6 tracking-widest">Адмирал</h2>
          <p className="text-white/50 font-light mb-8 leading-relaxed">
            Вызываем эмоции. Оставляем впечатление.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setPage('services')}
              className="group flex items-center text-sm tracking-widest uppercase text-white hover:text-white/70 transition-colors w-fit"
            >
              Услуги <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
            <button
              onClick={() => setPage('masters')}
              className="group flex items-center text-sm tracking-widest uppercase text-white hover:text-white/70 transition-colors w-fit"
            >
              Мастера <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 text-lg font-light">
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-white/40 shrink-0 mt-1" />
            <div>
              <p className="text-white/90">ул. Адмирала Фокина, 23в</p>
              <p className="text-white/40 text-sm mt-1">Владивосток</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Phone className="w-6 h-6 text-white/40 shrink-0" />
            <p className="text-white/90">+7 953 208-24-44</p>
          </div>

          <div className="flex items-center gap-4 mt-2">
             <a
               href="https://api.whatsapp.com/send/?phone=79532082444&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%0A%0A%D0%9F%D0%B8%D1%88%D1%83+%D0%B8%D0%B7+%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F+2%D0%93%D0%98%D0%A1.%0A%0A&type=phone_number&app_absent=0"
               target="_blank"
               rel="noreferrer"
               className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white"
             >
               <MessageCircle className="w-5 h-5" />
             </a>
             <a
               href="https://t.me/+79532082444"
               target="_blank"
               rel="noreferrer"
               className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white"
             >
               <Send className="w-5 h-5 -ml-1 cursor-pointer" />
             </a>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-white/30 text-sm flex justify-between tracking-widest uppercase w-full">
             <p>Пн — Вс, 10:00–21:00</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isBookingOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isBookingOpen]);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-[#030303] text-[#fafafa] selection:bg-white selection:text-black">
      <Navbar page={page} setPage={setPage} onBook={() => setIsBookingOpen(true)} />

      <main>
        {page === 'home' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <Hero />
            <MainInfo onBook={() => setIsBookingOpen(true)} setPage={setPage} />
            <MastersSection setPage={setPage} />
            <ReviewsCarousel />
            <FAQ />
            <div className="pb-32" />
          </motion.div>
        )}

        {page === 'services' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <ServicesPage onBook={() => setIsBookingOpen(true)} />
          </motion.div>
        )}

        {page === 'masters' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <MastersPage onBook={() => setIsBookingOpen(true)} />
          </motion.div>
        )}
      </main>

      <Footer setPage={setPage} />

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
