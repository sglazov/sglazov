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
  posts: 3
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
 * Ходит за постами
 */
async function loadNotes()
{
  const feed = await parser.parseURL(config.feed)

  let links = ''

  feed.items.slice(0, config.posts).forEach((item) => {

    /**
     * Очень дебильное форматирование, но хочу чистый MD
     *
     * ;—(
     */
    links += `
* [${item.title}](${item.link}) <br />
<sup>_${formatRuDate(item.pubDate)}_</sup>`
  })

  return links
}



(async () => {
  let notes = ''

  try
  {
    notes = await loadNotes()
  } catch (e) {
    console.error(`Не удалось загрузить записи блога ${config.site}`, e)
  }

  const result = `# \`<?= "console.log('Hello, World!')"; // o_0\`
My main languages are PHP and JavaScript, as I specialize in web apps and services. I value simplicity in my projects. I've mostly worked in startups and mid-sized companies. I am currently working with Laravel + Nuxt. I like to work with content projects: blogs, media.

## Some of [my articles](${config.blog}): <sup>_(in Russian)_</sup>
${notes}


## Buzzwords: Skills and Technologies
<details>
  <summary>hmm what</summary>

  ${shuffle(buzzwords).join(', ')}.
</details>

----
[**My CV**](${config.cv}), [github@sglazov.ru](mailto:github@sglazov.ru), [t.me/sglazov](https://t.me/sglazov).
`

  /**
   * Федеральная служба по контролю за оборотом файла `README.md`
   */
  fs.writeFile('README.md', result, function (err) {
    if (err) return console.log(err)

    // console.log(`${result} > README.md`)
  })

})()

/**
 * Если вам это всё надо — смело берите и используйте
 */
