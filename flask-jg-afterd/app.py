import json
import pprint
import datetime
from flask import Flask
from flask import request, jsonify, session
from setting import MYSQL_CONFIG
from datetime import datetime
import pymysql

app = Flask(__name__)


def query(email, password, type_):
    with pymysql.connect(
            host=MYSQL_CONFIG.get("HOST"),
            port=MYSQL_CONFIG.get("PORT"),
            user=MYSQL_CONFIG.get("USER"),
            password=MYSQL_CONFIG.get("PASSWORD"),
            database=MYSQL_CONFIG.get("DATABASE")
    ) as connection:
        cursor = connection.cursor()
        sql_query = "select priviledge from users where email=%s and password=%s and priviledge=%s"
        privilege = None
        try:
            cursor.execute(sql_query, (email, password, type_))
            privilege = cursor.fetchone()
        except Exception as e:
            print(e)
        cursor.close()
    return privilege


def mysql_get_all_category():
    with pymysql.connect(
            host=MYSQL_CONFIG.get("HOST"),
            port=MYSQL_CONFIG.get("PORT"),
            user=MYSQL_CONFIG.get("USER"),
            password=MYSQL_CONFIG.get("PASSWORD"),
            database=MYSQL_CONFIG.get("DATABASE")
    ) as connection:
        results = []
        cursor = connection.cursor()
        cursor.execute('select distinct book_type from books')
        for item in cursor.fetchall():
            results.append(item[0])
        cursor.close()
    return results


def search_data(sbt, sby, sbk, page):
    with pymysql.connect(
            host=MYSQL_CONFIG.get("HOST"),
            port=MYSQL_CONFIG.get("PORT"),
            user=MYSQL_CONFIG.get("USER"),
            password=MYSQL_CONFIG.get("PASSWORD"),
            database=MYSQL_CONFIG.get("DATABASE")
    ) as connection:
        single_sql_query_limit = MYSQL_CONFIG.get('SQL_PAGE_LIMIT')
        start_limit = (page - 1) * single_sql_query_limit
        cursor = connection.cursor()
        sql_query = 'select * from books where year(publish_date) = %s and name like %s ' \
                    ' and book_type = %s'
        results = None
        try:
            cursor.execute(sql_query, (sby, '%' + sbk + '%', sbt))
            results = cursor.fetchall()
            all_query_result_length = len(results)
            print(all_query_result_length)
        except Exception as e:
            print(e)
            all_query_result_length = 0
        cursor.close()
    return all_query_result_length, start_limit, results[start_limit: start_limit + single_sql_query_limit]


def mysql_delete_data(need_deleted_data):
    deleted_failed = []
    with pymysql.connect(
            host=MYSQL_CONFIG.get("HOST"),
            port=MYSQL_CONFIG.get("PORT"),
            user=MYSQL_CONFIG.get("USER"),
            password=MYSQL_CONFIG.get("PASSWORD"),
            database=MYSQL_CONFIG.get("DATABASE")
    ) as connection:
        cursor = connection.cursor()
        sql_delete_statement = 'delete from books where id = %s'
        print(f"Need deleted data is")
        for item in need_deleted_data:
            item_id = item['id']
            # bt = item['type']
            # book_name = item['name']
            # now_price = item['now_price']
            # discount = item['discount']
            # previous_price = item['previous_price']
            # publish_date = item['publish_date']
            # publisher = item['publisher']
            # detail = item['details']
            try:
                cursor.execute(sql_delete_statement, (item_id,))
                connection.commit()
            except Exception as e:
                print(f"Delete error", e)
                deleted_failed.append(item)
                connection.rollback()
        cursor.close()
    result_json = {
        "failed": deleted_failed
    }
    if deleted_failed:
        result_json['code'] = -1
        result_json['status'] = "some delete operation is failed"
    else:
        result_json['code'] = 1
        result_json['status'] = "successfully!"
    return result_json


def mysql_update_data(need_deleted_data):
    updated_failed = []
    with pymysql.connect(
            host=MYSQL_CONFIG.get("HOST"),
            port=MYSQL_CONFIG.get("PORT"),
            user=MYSQL_CONFIG.get("USER"),
            password=MYSQL_CONFIG.get("PASSWORD"),
            database=MYSQL_CONFIG.get("DATABASE")
    ) as connection:
        cursor = connection.cursor()
        sql_update_statement = 'update books set book_type = %s, name = %s, ' \
                               'now_price = %s, previous_price = %s, discount = %s, ' \
                               'publish_date = %s, publisher = %s, detail = %s where id = %s'
        for item in need_deleted_data:
            need_deleted_id = item['id']
            bt = item['type']
            book_name = item['name']
            now_price = item['now_price']
            discount = item['discount']
            previous_price = item['previous_price']
            publish_date = item['publish_date'][0]
            publisher = item['publisher']
            detail = item['details']
            try:
                cursor.execute(sql_update_statement, (
                    bt, book_name, now_price, previous_price, discount, publish_date, publisher, detail, need_deleted_id
                ))
                connection.commit()
            except Exception as e:
                print(f"update error", e)
                updated_failed.append(item)
                connection.rollback()
        cursor.close()
    result_json = {
        "failed": updated_failed
    }
    if updated_failed:
        result_json['code'] = -1
        result_json['status'] = "some update operation is failed"
    else:
        result_json['code'] = 1
        result_json['status'] = "successfully!"
    return result_json


def mysql_add_data(need_added_data):
    added_failed = []
    with pymysql.connect(
            host=MYSQL_CONFIG.get("HOST"),
            port=MYSQL_CONFIG.get("PORT"),
            user=MYSQL_CONFIG.get("USER"),
            password=MYSQL_CONFIG.get("PASSWORD"),
            database=MYSQL_CONFIG.get("DATABASE")
    ) as connection:
        cursor = connection.cursor()
        sql_insert_statement = 'insert into books (book_type, name, now_price, previous_price, publish_date, ' \
                               'publisher, discount, detail)' \
                               'values (%s, %s, %s, %s, %s, %s, %s, %s)'
        pprint.pprint(need_added_data)
        try:
            cursor.execute('select max(id) from books')
            book_current_id = cursor.fetchone()[0]
            if book_current_id is None:
                book_current_id = 0
            else:
                book_current_id += 1
            bt = need_added_data['type']
            book_name = need_added_data['name']
            now_price = need_added_data['now_price']
            discount = need_added_data['discount']
            previous_price = need_added_data['previous_price']
            publish_date = need_added_data['publish_date']
            publisher = need_added_data['publisher']
            detail = need_added_data['details']
            cursor.execute(sql_insert_statement, (
                bt, book_name, now_price, previous_price, publish_date, publisher, discount, detail
            ))
            connection.commit()
        except Exception as e:
            print(f"added error", e)
            added_failed.append(need_added_data)
            connection.rollback()
        cursor.close()
    result_json = {
        "failed": added_failed
    }
    if added_failed:
        result_json['code'] = -1
        result_json['status'] = "some update operation is failed"
    else:
        result_json['code'] = 1
        result_json['status'] = "successfully!"
        result_json['cid'] = book_current_id
    return result_json


def mysql_query_all_users(type_):
    with pymysql.connect(
            host=MYSQL_CONFIG.get("HOST"),
            port=MYSQL_CONFIG.get("PORT"),
            user=MYSQL_CONFIG.get("USER"),
            password=MYSQL_CONFIG.get("PASSWORD"),
            database=MYSQL_CONFIG.get("DATABASE")
    ) as connection:
        result = []
        cursor = connection.cursor()
        sql_query_statement = 'select email, password, priviledge from users where priviledge=%s'
        try:
            cursor.execute(sql_query_statement, (type_,))
            for item in cursor.fetchall():
                result.append({
                    "email": item[0],
                    "password": item[1],
                    "privilege": item[2]
                })
        except Exception as e:
            print(e)
        cursor.close()
    return result


def mysql_delete_user(need_deleted_user):
    deleted_user_failed = []
    with pymysql.connect(
            host=MYSQL_CONFIG.get("HOST"),
            port=MYSQL_CONFIG.get("PORT"),
            user=MYSQL_CONFIG.get("USER"),
            password=MYSQL_CONFIG.get("PASSWORD"),
            database=MYSQL_CONFIG.get("DATABASE")
    ) as connection:
        cursor = connection.cursor()
        sql_delete_user_statement = 'delete from users where email=%s'
        for item in need_deleted_user:
            email = item['email']
            try:
                cursor.execute(sql_delete_user_statement, (email,))
                connection.commit()
            except Exception as e:
                print("delete user", e)
                connection.rollback()
                deleted_user_failed.append(item)
        cursor.close()
    result_json = {
        "failed": deleted_user_failed
    }
    if deleted_user_failed:
        result_json['code'] = -1
        result_json['status'] = "some delete operation is failed"
    else:
        result_json['code'] = 1
        result_json['status'] = "successfully!"
    return result_json


def mysql_update_user(need_deleted_user):
    update_user_failed = []
    with pymysql.connect(
            host=MYSQL_CONFIG.get("HOST"),
            port=MYSQL_CONFIG.get("PORT"),
            user=MYSQL_CONFIG.get("USER"),
            password=MYSQL_CONFIG.get("PASSWORD"),
            database=MYSQL_CONFIG.get("DATABASE")
    ) as connection:
        cursor = connection.cursor()
        sql_update_user_statement = 'update users set password=%s, priviledge=%s where email=%s;'
        for item in need_deleted_user:
            email = item['email']
            password = item["password"]
            privilege = item['privilege']
            try:
                cursor.execute(sql_update_user_statement, (password, privilege, email))
                connection.commit()
            except Exception as e:
                print("delete user", e)
                connection.rollback()
                update_user_failed.append(item)
        cursor.close()
    result_json = {
        "failed": update_user_failed
    }
    if update_user_failed:
        result_json['code'] = -1
        result_json['status'] = "some delete operation is failed"
    else:
        result_json['code'] = 1
        result_json['status'] = "successfully!"
    return result_json


def mysql_add_user(need_added_user):
    add_user_failed = []
    result_json = {
        "failed": add_user_failed
    }
    with pymysql.connect(
            host=MYSQL_CONFIG.get("HOST"),
            port=MYSQL_CONFIG.get("PORT"),
            user=MYSQL_CONFIG.get("USER"),
            password=MYSQL_CONFIG.get("PASSWORD"),
            database=MYSQL_CONFIG.get("DATABASE")
    ) as connection:
        cursor = connection.cursor()
        sql_insert_user_statement = 'insert into users values(%s, %s, %s);'
        email = need_added_user['email']
        password = need_added_user["password"]
        privilege = need_added_user['privilege']
        try:
            cursor.execute(sql_insert_user_statement, (email, password, privilege))
            connection.commit()
        except pymysql.err.IntegrityError as e:
            result_json['code'] = -2
            result_json['status'] = "duplicate primary key"
            print("add user error", e)
            connection.rollback()
            add_user_failed.append(need_added_user)
        cursor.close()
    if not result_json.get('code'):
        if add_user_failed:
            result_json['code'] = -1
            result_json['status'] = "some delete operation is failed"
        else:
            result_json['code'] = 1
            result_json['status'] = "successfully!"
    return result_json


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


@app.route('/rest/api/data/get', methods=["GET"])
def get_data():
    passed_book_datas = []
    print(request.args)
    search_book_type = request.args.get('search_type')
    search_book_year = request.args.get('search_year')
    search_book_keyword = request.args.get('search_keyword')
    page = int(request.args.get('page'))
    print(search_book_keyword, search_book_year, search_book_type)
    print(request.args)
    date_length, offset, book_datas = search_data(
        search_book_type,
        search_book_year,
        search_book_keyword,
        page
    )
    for book_data in book_datas:
        if book_data[5] is None:
            std_time = None
        else:
            std_time = book_data[5].strftime("%Y-%m-%d"),
        passed_book_datas.append(
            {
                "id": book_data[0],
                "type": book_data[1],
                "name": book_data[2],
                "now_price": book_data[3],
                "previous_price": book_data[4],
                "publish_date": std_time,
                "publisher": book_data[6],
                "discount": book_data[7],
                "details": book_data[8]
            }
        )
    return jsonify(
        {
            'data': passed_book_datas,
            'page': page,
            'length': date_length,
            'offset': offset
        }
    )


@app.route('/rest/api/data/update', methods=["POST"])
def update_data():
    need_updated_data = json.loads(request.data.decode())['data']
    update_operation_result_json = mysql_update_data(need_updated_data)
    return jsonify(update_operation_result_json)


@app.route('/rest/api/data/delete', methods=["POST"])
def delete_data():
    need_deleted_data = json.loads(request.data.decode())['data']
    delete_operation_result_json = mysql_delete_data(need_deleted_data)
    return jsonify(delete_operation_result_json)


@app.route('/rest/api/data/add', methods=["POST"])
def add_data():
    need_added_data = json.loads(request.data.decode())['data']
    add_operation_result_json = mysql_add_data(need_added_data)
    return jsonify(add_operation_result_json)


@app.route('/rest/api/users/get', methods=["POST"])
def get_all_normal_users():
    query_type = request.args.get("query_type")
    print(f"|{query_type}|")
    all_normal_user = mysql_query_all_users(query_type)
    print(all_normal_user, end="----")
    return {
        "result": all_normal_user
    }


@app.route('/rest/api/users/update', methods=["POST"])
def update_user():
    need_updated_user = json.loads(request.data.decode())['data']
    result_json = mysql_update_user(need_updated_user)
    return result_json


@app.route('/rest/api/users/delete', methods=["POST"])
def delete_user():
    need_deleted_user = json.loads(request.data.decode())['data']
    result_json = mysql_delete_user(need_deleted_user)
    return result_json


@app.route('/rest/api/users/add', methods=["POST"])
def add_user():
    need_add_user = json.loads(request.data.decode())['data']
    result_json = mysql_add_user(need_add_user)
    return result_json


@app.route('/rest/api/category/get', methods=['POST'])
def get_all_category():
    categories = mysql_get_all_category()
    return {
        "category": categories
    }


@app.route('/rest/api/admin', methods=['POST'])
def verify_admin():
    account = request.form.get('account')
    passwd = request.form.get('password')
    login_type = request.form.get('xjy-type')
    print(f'Account is {account}, password is {passwd} and type is {login_type}')
    privilege = query(account, passwd, login_type)
    if privilege is None:
        return {
            "code": -1,
            "status": "failed"
        }
    else:
        return {
            "code": 1,
            "status": "successfully",
            "level": login_type
        }


if __name__ == '__main__':
    app.run()
