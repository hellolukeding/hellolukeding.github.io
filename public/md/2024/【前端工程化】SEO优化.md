# 搜索引擎工作流程

Google 搜索的工作流程分为 3 个阶段，并非每个网页都会经历这 3 个阶段：

1. [**抓取**](https://developers.google.com/search/docs/fundamentals/how-search-works?hl=zh-cn#crawling)：Google 会使用名为“抓取工具”的自动程序从互联网上发现各类网页，并下载其中的文本、图片和视频。
2. [**索引编制**](https://developers.google.com/search/docs/fundamentals/how-search-works?hl=zh-cn#indexing)：Google 会分析网页上的文本、图片和视频文件，并将信息存储在大型数据库 Google 索引中。
3. [**呈现搜索结果**](https://developers.google.com/search/docs/fundamentals/how-search-works?hl=zh-cn#serving)：当用户在 Google 中搜索时，Google 会返回与用户查询相关的信息。

## 抓取阶段

第一阶段是找出网络上存在哪些网页。不存在包含所有网页的中央注册表，因此 Google 必须不断搜索新网页和更新过的网页，并将其添加到已知网页列表中。此过程称为“网址发现”。由于 Google 之前已经访问过某些网页，因此这些网页是 Google 已知的网页。当跟踪已知网页上指向新网页的链接时，Google 会发现其他网页，例如类别网页等中心页会链接到新的博文。当您以列表形式（[站点地图](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=zh-cn)）提交一系列网页供 Google 抓取时，Google 也会发现其他网页。

Google 发现网页的网址后，可能会访问（或“抓取”）该网页以了解其中的内容。我们使用大量计算机抓取网络上的数十亿个网页。执行抓取任务的程序叫做 [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot?hl=zh-cn)（也称为抓取工具、漫游器或“蜘蛛”程序）。Googlebot 使用算法流程确定要抓取的网站、抓取频率以及要从每个网站抓取的网页数量。[Google 的抓取工具](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers?hl=zh-cn)也经过编程，确保不会过快地抓取网站，避免网站收到过多请求。此机制基于网站的响应（例如，[HTTP 500 错误意味着“降低抓取速度”](https://developers.google.com/search/docs/crawling-indexing/http-network-errors?hl=zh-cn#http-status-codes)）。

但是，Googlebot 不会抓取它发现的所有网页。某些网页可能被网站所有者设置为[禁止抓取](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt?hl=zh-cn#disallow)，而其他网页可能必须登录网站才能访问。

在抓取过程中，Google 会使用最新版 [Chrome](https://www.google.com/chrome/?hl=zh-cn) 渲染网页并[运行它找到的所有 JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics?hl=zh-cn#how-googlebot-processes-javascript)，此过程与浏览器渲染您访问的网页的方式类似。渲染很重要，因为网站经常依靠 JavaScript 将内容引入网页，缺少了渲染过程，Google 可能就看不到相应内容。

能否抓取取决于 Google 的抓取工具能否访问网站。Googlebot 访问网站时的一些常见问题包括：

- [服务器在处理网站时出现问题](https://developers.google.com/search/docs/crawling-indexing/http-network-errors?hl=zh-cn#http-status-codes)
- [网络问题](https://developers.google.com/search/docs/crawling-indexing/http-network-errors?hl=zh-cn#network-and-dns-errors)
- [robots.txt 规则阻止 Googlebot 访问网页](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=zh-cn)

## 索引编制

抓取网页后，Google 会尝试了解该网页的内容。这一阶段称为“索引编制”，包括处理和分析文字内容以及关键内容标记和属性，例如 [`<title>` 元素](https://developers.google.com/search/docs/appearance/title-link?hl=zh-cn)和 Alt 属性、[图片](https://developers.google.com/search/docs/appearance/google-images?hl=zh-cn)、[视频](https://developers.google.com/search/docs/appearance/video?hl=zh-cn)等。

在索引编制过程中，Google 会确定网页是否[与互联网上的其他网页重复或是否为规范网页](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=zh-cn)。 规范网页是可能会显示在搜索结果中的网页。为了选择规范网页，我们首先会将在互联网上找到的内容类似的网页归为一组（也称为聚类），然后从中选择最具代表性的网页。该组网页中的其他网页可作为备用版本在不同情况下提供，例如用户在移动设备上进行搜索时，或他们正在查找该组网页中的某个具体网页时。

Google 还会收集关于规范网页及其内容的信号，这些信号可能会在下一阶段（即在搜索结果中呈现网页）时用到。一些信号包括网页语言、内容所针对的国家/地区、网页易用性。

所收集的关于规范网页及其网页群组的相关信息可能会存储在 Google 索引（托管在数千台计算机上的大型数据库）中。我们无法保证网页一定会编入索引；并非 Google 处理的每个网页都会编入索引。

是否会编入索引还取决于网页内容及其元数据。一些常见的索引编制问题可能包括：

- [网页内容质量低](https://developers.google.com/search/docs/essentials?hl=zh-cn)
- [Robots `meta` 规则禁止编入索引](https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=zh-cn)
- [网站的设计可能使索引编制难以进行](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics?hl=zh-cn)

## 呈现搜索结果

用户输入查询时，我们的机器会在索引中搜索匹配的网页，并返回我们认为与用户的搜索内容最相关的优质结果。相关性是由数百个因素决定的，其中可能包括用户的位置、语言和设备（桌面设备或手机）等信息。例如，在用户搜索“自行车维修店”后，Google 向巴黎用户显示的结果与向香港用户显示的结果有所不同。

根据用户的查询，搜索结果页上显示的搜索功能也会发生变化。例如，如果您搜索“自行车维修店”，系统可能会显示本地搜索结果，而不会显示[图片搜索结果](https://developers.google.com/search/docs/appearance/visual-elements-gallery?hl=zh-cn#image-result)；不过，搜索“现代自行车”更有可能显示图片搜索结果，但不会显示本地搜索结果。您可以在我们的[视觉元素库](https://developers.google.com/search/docs/appearance/visual-elements-gallery?hl=zh-cn)中探索 Google 网页搜索中最常见的界面元素。

Search Console 可能提示您某个网页已编入索引，但您在搜索结果中看不到该网页。 这可能是因为：

- [网页内容与用户查询无关](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-cn#expect-search-terms)
- [内容质量低](https://developers.google.com/search/docs/essentials?hl=zh-cn)
- [Robots `meta` 规则阻止提供内容](https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=zh-cn)

# SEO 优化的方法

1. **关键词优化** ：研究并使用与你的网站内容相关的关键词。这些关键词应该出现在你的标题、URL、头部标签（H1, H2 等）、内容和 meta 描述中。
2. **高质量内容** ：提供有价值、独特和高质量的内容。这可以提高你的网站在搜索引擎结果中的排名，并吸引更多的访问者。
3. **移动优化** ：确保你的网站在移动设备上也能正常工作。搜索引擎会优先考虑移动友好的网站。
4. **加载速度** ：优化你的网站以减少加载时间。这可以包括压缩图片、减少 HTTP 请求和使用 CDN。
5. **内部链接** ：在你的网站内部使用链接可以帮助搜索引擎理解你的网站结构，并提高你的网站在搜索引擎结果中的排名。
6. **外部链接** ：获取高质量的外部网站链接到你的网站。这可以提高你的网站的权威性，并提高你的网站在搜索引擎结果中的排名。
7. **元标签优化** ：使用 meta 标签来描述你的网站内容。这包括使用 meta 描述标签来提供一个简短的网站描述，使用 meta 关键词标签来提供相关关键词，以及使用 meta robots 标签来控制搜索引擎爬虫的行为。
8. **结构化数据** ：使用结构化数据（如 JSON-LD 或微数据）来提供关于你的网站的详细信息。这可以帮助搜索引擎更好地理解你的网站内容，并可能导致在搜索结果中显示更丰富的结果。
9. **HTTPS** ：使用 HTTPS 来保护你的网站访问者的信息。搜索引擎会优先考虑使用 HTTPS 的网站。
10. **社交媒体优化** ：使用社交媒体来推广你的网站。这可以帮助你吸引更多的访问者，并可能导致更多的外部链接。
