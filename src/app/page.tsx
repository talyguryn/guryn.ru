import { formatDate, getNotesPosts } from '@/app/notes/utils';

const projectList: Array<{
  name: string;
  url: string;
  description?: string;
  year?: number;
}> = [
  {
    name: 'Solar Activity Alerts',
    url: 'https://t.me/solar_activity_alerts',
    description: 'Канал с оповещениями о солнечной активности',
  },
  {
    name: 'SSH Quick Connect',
    url: 'https://github.com/talyguryn/ssh-quick-connect',
    description: 'Утилита для быстрого подключения по SSH',
  },
  {
    name: 'pamyatkin.ru',
    url: 'https://pamyatkin.ru',
    description: 'Сервис для создания PDF-памяток онлайн',
  },
  {
    name: 'Stickerum',
    url: 'https://t.me/stickerum_bot',
    description: 'Сервис для создания листа стикеров для печати и нарезки',
  },
  {
    name: 'Animated Weather',
    url: 'https://t.me/weather_gif_bot',
    description: 'Бот, отправляющий анимированные прогнозы погоды',
  },
  {
    name: 'Cost Per Unit',
    url: '/cost-per-unit',
    description: 'Калькулятор стоимости за единицу товара',
  },
  {
    name: 'Казан и Звезды',
    url: 'https://t.me/kazanzvezdy',
    description: 'Сообщество любителей вкусно поесть на природе',
  },
  {
    name: 'Time Lapse Maker',
    url: 'https://github.com/Aurora-Hunters/timelapse-maker',
    description: 'Приложение создания таймлапсов из фотографий',
  },
  {
    name: 'Imagram Bot',
    url: 'https://t.me/imagram_bot',
    description: 'Бот для скачивания постов, рилсов и сторис',
  },
  {
    name: 'WB Stickers',
    url: 'https://t.me/wildber_robot',
    description: 'Бот для сортировки стикеров по листам подбора',
  },
  {
    name: 'Spam Filter Bot',
    url: 'https://t.me/spam_filter_robot',
    description: 'Бот для борьбы со спамом в Telegram-чатах',
  },
  {
    name: 'Sticker to Image',
    url: 'https://t.me/stimagebot',
    description: 'Бот для конвертации стикеров в изображения',
  },
  {
    name: 'Contourer',
    url: 'https://github.com/stickerum/contourer',
    description: 'Сервис для создания контуров реза для стикеров',
  },
  {
    name: 'Skim',
    url: 'https://github.com/talyguryn/skim',
    description: 'Сервис для создания скриншотов сайтов',
  },
  {
    name: 'Sentry Checker',
    url: 'https://github.com/talyguryn/sentry-checker',
    description:
      'Расширение для Chrome, которое показывает, подключен ли Sentry к сайту',
  },
  {
    name: 'IPv4 Waiting List',
    url: 'https://t.me/IPv4_Waiting_List',
    description: 'Оповещения о переназначении IPv4 и IPv6 сетей',
  },
  {
    name: 'GPT Gateway',
    url: 'https://github.com/talyguryn/gpt-gateway',
    description: 'Сервер для общения с LLM-моделями через API',
  },
];

export default async function Page() {
  return (
    <div className="mb-32">
      {/* <div>
        {getNotesPosts().map((post) => (
          <a
            className="block mb-8 no-underline! hover:underline!"
            href={`/notes/${post.slug}`}
            key={post.slug}
          >
            <div>
              <div className="font-bold text-xl">{post.metadata.title}</div>
              <div>{post.metadata.summary}</div>
            </div>
          </a>
        ))}
      </div> */}

      <div>
        <div className="font-bold text-3xl mb-4">Проекты</div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          {projectList.map((project) => (
            <li
              key={project.name}
              className="flex flex-col md:flex-row md:items-start mb-2"
            >
              <a
                className="flex flex-col md:flex-row md:items-start w-full"
                href={project.url}
                target="_blank"
              >
                <span className="font-semibold md:w-1/3 w-full underlined">
                  {project.name}
                </span>
                {project.description && (
                  <span className="text-gray-500 md:w-2/3 w-full md:ml-4">
                    {project.description}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
