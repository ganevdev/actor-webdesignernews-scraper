import { ElementHandle, Page } from 'puppeteer';

import getAttribute from './utils/get-attribute';

async function postElementToObject(
  postElement: ElementHandle
): Promise<Post | undefined> {
  const title = await getAttribute(
    await postElement.$('div[class="post-info"] > h2')
  );
  const vote = Number(
    await getAttribute(await postElement.$('div[class="post-vote-cell"]'))
  );
  const thumb = await getAttribute(
    await postElement.$('img[class="post-thumb-img"]'),
    'src'
  );
  const link = await getAttribute(
    await postElement.$('div[class="post-thumb"] > a'),
    'href'
  );
  const source = await getAttribute(
    await postElement.$('a[class="site-name-lnk"]')
  );
  const date = await getAttribute(
    await postElement.$('span[class="made-popuplar"]')
  );
  if (title) {
    return {
      title: title,
      vote: vote,
      thumb: thumb,
      link: link,
      source: source,
      date: date
    };
  }
}

/**
 * Scrap posts from webdesignernews.com - return array of objects - Post
 *
 */
export default async function scrapPosts(
  page: Page
): Promise<(Post | undefined)[]> {
  const postsBlock = await page.$('div[id="post-rows-block-latest"]');
  if (postsBlock) {
    const divPostsArray = await page.$$('div[class="post-row"]');
    const postsElement = await Promise.all(
      divPostsArray.map(
        async (postElement: ElementHandle): Promise<Post | undefined> => {
          const postElementObjects = await postElementToObject(postElement);
          return postElementObjects;
        }
      )
    );
    const postsElementClean = postsElement.filter(Boolean);
    return postsElementClean;
  } else {
    return [];
  }
}
