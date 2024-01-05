const conn = require('../mariadb');
const dotenv = require('dotenv');
const {StatusCodes} = require('http-status-codes');
dotenv.config();

const bookfunctions = {
    selectAllBooks: (req, res) => {
        let sql = `SELECT id, title, summary, author, price, pub_date FROM books`;

        conn.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
    
                return res.status(StatusCodes.OK).json(results);
            }
        );
    },
    
    selectCategoryBooks: (req, res) => {
        const categoryId = req.query.categoryId;
        const isNew = req.query.new;

    },

    selectSingleBook: (req, res) => {
        let booksId = req.params.booksId;
        
        let sql = `SELECT id, title, summary, author, price, pub_date FROM books WHERE id = ?`;

        conn.query(sql, booksId, 
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                
                if(results[0]) return res.status(StatusCodes.OK).json(results[0]);
                else return res.status(StatusCodes.NOT_FOUND).end();
            }
        );
    },
};

module.exports = bookfunctions;
