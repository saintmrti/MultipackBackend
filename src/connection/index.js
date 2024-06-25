const mssql = require('mssql');
const config = require('./config');

class Connection {
    constructor(transaction = false) {
        this.pool = null;
        this.request = null;
        this.transaction = null;
        this.setTransaction = transaction;
    }
    query(sql) {
		return new Promise(async (resolve, reject) => {
			try {
				if(this.pool === null) {
					this.pool = await new mssql.ConnectionPool(config).connect();
					if(this.setTransaction) {
						this.transaction = new mssql.Transaction(this.pool);
						this.request = new mssql.Request(this.transaction);
						await this.transaction.begin();
					} else {
						this.request = new mssql.Request(this.pool);
					}
				}
				const { recordsets, recordset } = await this.request.query(`${sql}; SELECT SCOPE_IDENTITY() AS insertId;`);
				let result;
				if (recordsets.length > 1) {
					result = Connection.prepare(null, recordset);
				} else {
					result = Connection.prepare(null, {}, recordset[0]);
				}
				resolve(result);
				return undefined;
				
			} catch (error) {
				console.log(sql);
				console.log(error);
				if(this.setTransaction) {
					this.transaction.rollback();
					this.setTransaction = false;
				}
				return reject(Connection.prepare(error));
			}
		})
    }
    close() {
		if(this.setTransaction) {
			this.transaction.commit();
		}
		if(this.pool){
			this.pool.close()
		}
	}
	static prepare(error, data = {}, info) {
		const isError = (error !== null);
		return {
			error,
			isError,
			data,
			info,
		};
	}
}
module.exports = Connection;