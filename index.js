/**
 * Создаёт настроение и файл `README.md`
 * Парсит RSS-ленту постов
 */
const fs = require('fs')
const Parser = require('rss-parser')
const parser = new Parser()

const buzzwords = require('./buzzwords.js')

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5)
}

const config = {
  site: 'https://sglazov.ru',
  blog: 'https://sglazov.ru/notes/',
  cv: 'https://sglazov.ru/cv/',
  feed: 'https://sglazov.ru/notes/feed/',
  posts: 3,
  cacheFile: 'feed-cache.txt'
}


/**
 * Форматировалка даты
 */
const formatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
function formatRuDate(pubDate) {
  const date = new Date(pubDate)
  return formatter.format(date).replace(' y.', '')
}

/**
 * Читает кэш из файла
 * @returns {Array} Массив ссылок из кэша или пустой массив, если файл не существует
 */
function readCache() {
  try {
    if (fs.existsSync(config.cacheFile)) {
      const cacheContent = fs.readFileSync(config.cacheFile, 'utf8')
      return cacheContent.split('\n').filter(link => link.trim() !== '')
    }
  } catch (err) {
    console.error('Ошибка при чтении кэша:', err)
  }
  return []
}

/**
 * Сохраняет ссылки в кэш
 * @param {Array} links Массив ссылок для сохранения
 */
function saveCache(links) {
  try {
    fs.writeFileSync(config.cacheFile, links.join('\n'), 'utf8')
  } catch (err) {
    console.error('Ошибка при сохранении кэша:', err)
  }
}

/**
 * Ходит за постами
 * @returns {Object} Объект с ссылками и HTML-разметкой для README
 */
async function loadNotes() {
  const feed = await parser.parseURL(config.feed)
  const items = feed.items.slice(0, config.posts)
  
  // Получаем ссылки на заметки
  const links = items.map(item => item.link)
  
  // Формируем HTML для README
  let linksHtml = ''
  items.forEach((item) => {
    linksHtml += `
* [${item.title}](${item.link}) <br />
<sup>_${formatRuDate(item.pubDate)}_</sup>`
  })

  return { links, linksHtml }
}

/**
 * Проверяет, изменились ли ссылки по сравнению с кэшем
 * @param {Array} newLinks Новые ссылки
 * @param {Array} cachedLinks Ссылки из кэша
 * @returns {Boolean} true, если ссылки изменились
 */
function hasLinksChanged(newLinks, cachedLinks) {
  if (newLinks.length !== cachedLinks.length) {
    return true
  }
  
  for (let i = 0; i < newLinks.length; i++) {
    if (newLinks[i] !== cachedLinks[i]) {
      return true
    }
  }
  
  return false
}

/**
 * Генерирует содержимое README.md
 * @param {String} notesHtml HTML-разметка для заметок
 * @returns {String} Содержимое README.md
 */
function generateReadme(notesHtml) {
  return `# \`<?= "console.log('Hello, World!')"; // o_0\`
My main languages are PHP and JavaScript, as I specialize in web apps and services. I value simplicity in my projects. I've mostly worked in startups and mid-sized companies. I am currently working with Laravel + Nuxt. I like to work with content projects: blogs, media.

## Some of [my articles](${config.blog}): <sup>_(in Russian)_</sup>
${notesHtml}


## Buzzwords: Skills and Technologies
<details>
  <summary>hmm what</summary>

  ${shuffle(buzzwords).join(', ')}.
</details>

----
[**My CV**](${config.cv}), [github@sglazov.ru](mailto:github@sglazov.ru), [t.me/sglazov](https://t.me/sglazov).
`
}

(async () => {
  try {
    // Загружаем заметки
    const { links, linksHtml } = await loadNotes()
    
    // Читаем кэш
    const cachedLinks = readCache()
    
    // Проверяем, изменились ли ссылки
    const linksChanged = hasLinksChanged(links, cachedLinks)
    
    if (linksChanged) {
      console.log('Обнаружены новые заметки, обновляю README.md')
      
      // Генерируем README
      const result = generateReadme(linksHtml)
      
      // Сохраняем README
      fs.writeFileSync('README.md', result, 'utf8')
      
      // Обновляем кэш
      saveCache(links)
    } else {
      console.log('Новых заметок нет, README.md не обновляется')
    }
  } catch (e) {
    console.error(`Не удалось загрузить записи блога ${config.site}`, e)
  }
})()

/**
 * Если вам это всё надо — смело берите и используйте
 */
