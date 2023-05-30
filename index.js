/**
 * Создаёт настроение и файл `README.md`
 * Парсит RSS-ленту постов
 */
const fs = require('fs')
const Parser = require('rss-parser')
const parser = new Parser()


const config = {
  site: 'https://sglazov.ru',
  blog: 'https://sglazov.ru/notes/',
  feed: 'https://sglazov.ru/notes/feed/',
  posts: 3
}


/**
 * Форматировалка даты
 */
const formatter = new Intl.DateTimeFormat('ru', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
function formatRuDate(pubDate) {
  const date = new Date(pubDate)
  return formatter.format(date).replace(' г.', '')
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
I’m Sergey and I make websites. I am currently working with Laravel and Nuxt<sup>v3</sup>. I like to work with content projects: blogs, media. I like order in files, have a sense of taste and ideals of beauty in the project.

## On [My Blog](${config.blog}) <sup>_(in Russian)_</sup>
${notes}


## Knowledge and skills as tags
<details>
  <summary>hmm what</summary>

  CSS, HTML, SCSS, PostCSS, Stylus, styled-components, Less, БЭМ, Pug (Jade), Nunjucks, JavaScript, jQuery, a11y, Eleventy, MarkDown, Gulp, Grunt, Cypress, Git, GitHub, GitHub Actions, GitLab, Bitbucket, Sketch, Zeplin, Avacode, Photoshop, Figma, SVG, React, Vue, Nuxt3, Deployer.php, PHP, WordPress, Laravel, Laravel Nova, Blade, Flarum, Shop-Script, Bootstrap, ispmanager, Reg.ru, TimeWeb, Docker, MAMP.
</details>

----
[github@sglazov.ru](mailto:github@sglazov.ru)
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
