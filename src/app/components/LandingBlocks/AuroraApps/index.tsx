import styles from "./styles.module.css";

const auroraProducts = [
  {
    name: "Solar Activity Alerts",
    description: "Канал с уведомлениями о солнечной активности",
    image: "/solar-activity-alerts-logo.jpg",
    link: "https://t.me/solar_activity_alerts",
  },
  {
    name: "Weather Gif Bot",
    description:
      "Бот, который показывает погоду, графики активности и камеры с небом",
    image: "/weather-gif-bot-logo.jpg",
    link: "https://t.me/weather_gif_bot",
  },
  {
    name: "Timelapse Maker",
    description: "Программа для создания таймлапсов на macOS, Windows и Linux",
    image: "/timelapse-maker-logo.png",
    link: "https://github.com/Aurora-Hunters/timelapse-maker#readme",
  },
];

const AuroraApps = () => {
  return (
    <div className={styles.aurora__container}>
      <div className={styles.aurora__bg}></div>
      <div className={styles.aurora}></div>
      <div className="max-w-5xl mx-auto px-4 py-16  z-10 rounded-xl">
        <h2 className="text-4xl font-bold text-white">
          Охотнику за северным сиянием
        </h2>
        <p className="my-4 mb-16 lg:w-1/2 w-100">
          Сервисы для мониторинга сияний, поиска лучших мест и создания видео.
        </p>

        {auroraProducts.map((product, index) => (
          <div key={product.name}>
            <div className="flex gap-8 mb-8 items-start">
              <div className="w-1/3 sm:w-16 md:w-1/12 rounded-2xl overflow-hidden">
                <a
                  href={product.link}
                  className="hover:cursor-pointer hover:underline"
                  target="_blank"
                  key={index}
                >
                  <img src={product.image} alt={product.name} />
                </a>
              </div>

              <div className="w-5/12 sd:w-2/12 md:w-5/12 flex flex-col gap-2">
                <a
                  href={product.link}
                  className="hover:cursor-pointer hover:underline"
                  target="_blank"
                  key={index}
                >
                  <h3 className="text-2xl font-bold">{product.name}</h3>
                </a>
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuroraApps;
