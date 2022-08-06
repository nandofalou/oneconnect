const sqlite3 = require('sqlite3').verbose()
import inittable from './inittable'

const model = {
    file: "database.db3",
    db: null,
    debug: false,
    table: null,

    init: () => {
        model.db = new sqlite3.Database("database/database.db3")
        model.showDebug({ log: 'init suceess' });
        inittable.init(model.db)
        inittable.execute()
    },

    query(sqlQry, callback) {
        model.db.all(sqlQry, function (err, row) {
            if (err) {
                console.warn('DB Error', err)
            } else {
                model.showDebug({ sqlQry })
            }
            callback(err, row)
        });
    },

    get: (params, callback) => {

        if (typeof (params) !== "object") {
            params = {}
        }

        let ite = {
            select: params.fields ? params.fields.join(", ") : '*',
            // filter: params.filter ? ' WHERE ' + params.filter.join(" AND ") : '',
            filter: params.filter ? ` WHERE ${params.filter} ` : '',
            limit: params.limit ? ` LIMIT ${params.limit} ` : '',
            offset: params.offset ? ` OFFSET ${params.offset} ` : '',
            orderby: params.orderby ? ` ORDER BY ${params.orderby} ` : '',
            table: params.table
        }

        const sql = `SELECT ${ite.select} from ${ite.table} ${ite.filter} ${ite.limit} ${ite.offset}`
        model.query(sql, callback)
    },

    insert: (table, fields, callback) => {
        const cols = Object.keys(fields).join(", ")
        const placeholders = Object.keys(fields).fill('?').join(", ")
        const sql = 'INSERT INTO ' + table + ' (' + cols + ') VALUES (' + placeholders + ')'
        const vl = Object.values(fields)
        let statement = model.db.prepare(sql);
        statement.run(vl, function (error) {
            if (error) {
                console.log('DB Error', error.message)
                model.showDebug({ sql, vl })
                callback(false)
            } else {
                const result = {
                    "insertId": this.lastID,
                    "affectedRows": this.changes,
                }
                model.showDebug({ sql, vl,result })
                callback(this.lastID)
            }
        })
    },

    insertBath: (table, arrfields, callback) => {
        const rows = []
        const cols = Object.keys(arrfields[0]).join(", ")
        let sql = 'INSERT INTO ' + table + ' (' + cols + ') VALUES '
        arrfields.forEach(fields => {
            const placeholders = Object.values(fields).join("','")
            rows.push(`('${placeholders}')`)
        });

        sql += rows.join(",") + ";"
        console.log('esquema:', sql)
        model.query(sql, callback)
    },

    update(table, fields, filter, fnc) {
        const cols = Object.keys(fields).join("=? , ")
        const sql = 'UPDATE ' + table + ' set ' + cols +' =? where ' + filter
        const vl = Object.values(fields)
        let statement = model.db.prepare(sql);
        statement.run(vl, (err, results) => {             
            if(err) {
                console.log(err);
                fnc(err, false);
            } else {
                fnc(null, results);
            }
        })
    },
    
    truncate: (table, callback) => {
        const sql = 'DELETE FROM ' + table + ' ;'
        model.db.run(sql, (err) => {
            if (err) {
                console.warn('DB Error', err.message)
                callback(false)
            } else {
                model.showDebug({ sql })
                callback(true)
            }
            model.showDebug(`Truncate table ${table}`);
        });
    },
    getNow: ()=> {
        let crDate = new Date()
        return crDate.getFullYear() + "-" + model.addzero(crDate.getMonth() + 1) + "-" + model.addzero(crDate.getDate()) + " " + model.addzero(crDate.getHours()) + ":" + model.addzero(crDate.getMinutes()) + ":" + model.addzero(crDate.getSeconds())
    },
    addzero: (n)=>{
    if (n <= 9) {
        return "0" + n;
    }
    return n
    },
    showDebug: (sql) => {
        if (model.debug) {
            console.log(sql)
        }
    }

}

export default model
