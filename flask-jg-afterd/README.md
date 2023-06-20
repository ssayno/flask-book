# 起始条件
1. 安装 mysql
    ```mysql
    create table if not exists users(
	email varchar(40) primary key,
	password varchar(20) not null,
	priviledge ENUM('admin', 'normal-user') not null,
   )
   insert into users values("admin", "090602", "admin");
   insert into users values("1", "1", "normal-user");
   
   
   
   create table if not exists books(
       id int auto_increment primary key,
       book_type varchar(10) not null,
       name varchar(256) not null,
       now_price double(8, 2) not null,
       previous_price double(8, 2) not null,
       publish_date date,
       publisher varchar(100),
       discount varchar(6),
       detail text
   )
    ```
2. 为了数据够多，使用爬虫获取数据
   ```python
   import csv
   from bs4 import BeautifulSoup
   import asyncio
   import aiohttp
   
   search_type = 'python'
   
   lock = asyncio.Lock()
   csv_file = open(f'{search_type}-result.csv', 'w+', encoding='U8')
   csv_writer = csv.writer(csv_file)
   csv_writer.writerow([
       '类型', '书名', '出版日期', '出版社', '现价', '原价', '折扣', '详细说明', '图片地址'
   ])
   
   
   async def crawl_single_page(url, session, params, page_index):
       try:
           params["page_index"] = page_index
           async with session.get(url, params=params) as resp:
               html_text = await resp.text(encoding="gbk")
               await extract_info(html_text)
           await asyncio.sleep(4)
       except Exception as e:
           print(e)
           return
       # use async with statement, we needn't type `resp.close()`
       # resp = await session.get(url, params=params)
       # page_count = await get_page_count(resp)
       # resp.close()
       # return page_count
   
   
   async def get_page_count(url, session, init_params):
       init_params["page_index"] = 1
       async with session.get(url, params=init_params) as resp:
           html_text = await resp.text(encoding="gbk")
       soup = BeautifulSoup(html_text, 'lxml')
       pages = soup.find_all(name='a', attrs={"name": "bottom-page-turn"})[-1].text
       return pages
   
   
   async def extract_info(html_text):
       soup = BeautifulSoup(html_text, 'lxml')
       li_tags = soup.select('#component_59 > li')
       result_maps = []
       for li_tag in li_tags:
           # get image url
           image_tag = li_tag.find('img')
           image_src = image_tag.attrs['src']
           if 'none' in image_src:
               image_src = image_tag.attrs['data-original']
           if not image_src.startswith('https:'):
               image_src = f'https:{image_src}'
           # get title
           title_p = li_tag.find('p', attrs={"class": "name", "name": "title"})
           book_name = title_p.text
           # detail
           detail_p = li_tag.find('p', attrs={"class": "detail"})
           details = detail_p.text
           # print(details)
           # price
           price_p = li_tag.find('p', attrs={"class": "price"})
           now_price = price_p.find('span', attrs={"class": "search_now_price"}).text
           previous_price = price_p.find('span', attrs={"class": "search_pre_price"})
           if previous_price is None:
               previous_price = now_price
           else:
               previous_price = previous_price.text
           discount = price_p.find('span', attrs={"class": "search_discount"})
           if discount is None:
               discount = "10折"
           else:
               discount = discount.text.replace(
                   '\xa0', ''
               ).replace('(', '').replace(')', '')
           # print(now_price, previous_price, discount)
           # search author
           search_author = li_tag.find('p', attrs={"class": "search_book_author"})
           infos = search_author.find_all('span')
           author = infos[0].text
           publish_data = infos[1].text.lstrip(' /')
           press = infos[2].text.lstrip(' /')
           # print(author, publish_data, press)
           result_maps.append([
               search_type, book_name, publish_data, press, now_price, previous_price, discount, details, image_src
           ])
       async with lock:
           csv_writer.writerows(result_maps)
   
   
   async def main(search_type):
       headers = {
           "Host": "search.dangdang.com",
           "Cache-Control": "max-age=0",
           "Upgrade-Insecure-Requests": "1",
           "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
           "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
           "Referer": "http://search.dangdang.com/?key=python&SearchFromTop=1&catalog=",
           "Accept-Language": "zh,zh-CN;q=0.9",
           "Proxy-Connection": "keep-alive"
       }
       cookies = {
           "ddscreen": "2",
           "__permanent_id": "20230429171130828225542237863733452",
           "__ddc_15d": "1682759491%7C!%7C_ddclickunion%3DP-129054",
           "__ddc_15d_f": "1682759491%7C!%7C_ddclickunion%3DP-129054",
           "__visit_id": "20230430210302289132255947777442641",
           "__out_refer": "1682859782%7C!%7Cwww.google.com%7C!%7C",
           "dest_area": "country_id%3D9000%26province_id%3D111%26city_id%3D0%26district_id%3D0%26town_id%3D0",
           "__rpm": "...1682859810817%7Cs_112100.155956512835%2C155956512836..1682860072930",
           "search_passback": "91da83bf7b229c4f29684e64fc0100002aa86400ad664e64",
           "__trace_id": "20230430210753806298993738680917559",
           "pos_9_end": "1682860074018",
           "pos_0_end": "1682860074075",
           "ad_ids": "31898396%2C14129493%2C5066933%7C%233%2C3%2C3",
           "pos_0_start": "1682860303914"
       }
       url = "http://search.dangdang.com/"
       params = {
           "key": search_type,
           "SearchFromTop": "1",
           "catalog": "",
       }
       #
       tasks = []
       session = aiohttp.ClientSession(headers=headers, cookies=cookies)
       pages = await get_page_count(url, session, init_params=params)
       print(pages)
       for i in range(1, 100):
           in_page_index = i + 1
           tasks.append(
               crawl_single_page(url, session, params=params, page_index=in_page_index)
           )
       await asyncio.gather(*tasks)
       await session.close()
   
   
   if __name__ == '__main__':
       asyncio.run(main(search_type))
       csv_file.close()
   ```
3. 使用 pymysql 插入数据
   ```python
   import pymysql
   import csv
   
   
   def extract_data_from_csv_file(csv_file):
       with open(csv_file, 'r', encoding='U8') as f:
           csv_reader = csv.reader(f)
           next(csv_reader)
           yield from csv_reader
   
   
   def handle(data):
       with pymysql.connect(
           host='localhost',
           port=3306,
           user='root',
           password='271xufei.',
           database='jyge'
       ) as connection:
           cursor = connection.cursor()
           sql_insert_statement = 'insert into books values (%s, %s, %s, %s, %s, %s, %s, %s, %s)'
           for single_data in data:
               [book_type, book_name, pb_date, publisher, now_price, pre_price, discount, detail, _] = single_data
               if pb_date == "":
                   pb_date = None
               book_type = book_type.strip()
               book_name = book_name.strip()
               publisher = publisher.strip()
               detail = detail.strip()
               now_price = float(now_price.strip('¥'))
               pre_price = float(pre_price.strip('¥'))
               discount = int(float(discount.replace('折', '')) * 10)
               try:
                   cursor.execute(sql_insert_statement, (
                       None, book_type, book_name, now_price, pre_price, pb_date, publisher, discount, detail
                   ))
                   connection.commit()
               except Exception as e:
                   print(e)
                   connection.rollback()
           cursor.close()
   
   
   if __name__ == '__main__':
       iter_data = extract_data_from_csv_file('Python-result.csv')
       handle(data=iter_data)
   ```
4. 安装 npm，网上找如何和安装，进入 `flask-jg` 这个文件夹，执行 `npm install`, 安装依赖之后使用 `npm start` 启动前端
5. 进入 `flask-js-after` 启动 `flask` 后端，然后读代码，理解咋实现的就可以了
6. 代码主要是前端多 `flask` 用的是主要是 `restful api` 来处理数据，可以查查啥是 `restful api`
7. 留了一个注册功能，一个显示管理员账户功能给你实现
8不懂问我，我不太清除你是否会 前后端分离，（当然我技术也很一般，写的比较乱
