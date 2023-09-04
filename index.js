/**
 * This small free software is a query builder of mysql for node or express JS developer
 * You can customize it for yourself to use with other DBMS
 * It's BEST for building API(s)!!!
 */

const { format } = require('date-fns'); // a dependency for node js (date-functions)

// insert
function insert(tbl, cols) {
    let colsVal = '';
    if (cols instanceof Array) {
        // Specifying the collumns
        for (i = 0; i < cols.length; i++) {
            colsVal += '`' + cols[i] + '`';
            if (i !== (cols.length - 1)) {
                colsVal += ', ';
            }
        }
    } else {
        colsVal = '`' + cols + '`';
    }

    // INSERT INTO `users` (`username`, `password`) VALUES (?)
    const q = "INSERT INTO `" + tbl + "` (" + colsVal + ") VALUES (?)";
    return q;
}

// update
function update(tbl, updateCols, whereCols) {
    let updateColsVal = '';
    if (updateCols instanceof Array) {
        for (i = 0; i < updateCols.length; i++) {
            updateColsVal += '`' + updateCols[i] + '`=?';
            if (i !== (updateCols.length - 1)) {
                updateColsVal += ', ';
            }
        }
    } else {
        updateColsVal = '`' + updateCols + '`=?';
    }

    let whereColsVal = '';
    if (whereCols instanceof Array) {
        for (i = 0; i < whereCols.length; i++) {
            whereColsVal += '`' + whereCols[i] + '`=?';
            if (i !== (whereCols.length - 1)) {
                whereColsVal += ' AND ';
            }
        }
    } else {
        whereColsVal = '`' + whereCols + '`=?';
    }

    // UPDATE `users` SET `username`=?, `password`=? WHERE `username`=? AND `password`=?
    const q = "UPDATE `" + tbl + "` SET " + updateColsVal + " WHERE " + whereColsVal;
    return q;
}

// getRows
function getRows(tbl, sortCol = 'id', sortVal = 'ASC') {
    // SELECT * FROM `users` ORDER BY `id` ASC
    const q = "SELECT * FROM `"
                + tbl
                + "` ORDER BY `" + sortCol + "` " + sortVal;
    return q;
}

// deleteRow
function deleteRow(tbl, idCol, idVal, status = false) {
    // update the updated_at COLLUMN for specifying the 'delete time'
    const updated_at = "UPDATE `" + tbl + "` SET updated_at='"
                        + format(new Date(), 'yyyy-MM-dd HH:mm:ss')
                        + "' WHERE `" + idCol + "` = '" + idVal + "'";

    // move the row to another table,
    const move_to_other_tbl = "INSERT INTO `" + tbl + "_deleted` SELECT * FROM `" + tbl + "` "
                            + "WHERE `" + idCol + "` = '" + idVal + "'";
    
    // and then delete it
    const deleting = "DELETE FROM `" + tbl + "` WHERE `"
                        + idCol + "` = '" + idVal + "'";

    // building the query
    const q = (status == 'updated_at')
                ? updated_at
                : (status == 'move')
                    ? move_to_other_tbl
                    : (status == 'delete')
                        ? deleting
                        : deleting;
    
    return q;
}

// searchRows
function searchRows(tbl, qCol, qVal, sortCol = 'id', sortVal = 'ASC') {
    // SELECT * FROM `users` WHERE `username` LIKE '%ruby%' ORDER BY `id` ASC
    const q = "SELECT * FROM `"
                + tbl
                + "` WHERE `" + qCol + "` LIKE '%" + qVal + "%'"
                + " ORDER BY `" + sortCol + "` " + sortVal;
    return q;
}

// getRowById
function getRowById(tbl, idCol, idVal) {
    // SELECT * FROM `users` WHERE `id`='2'
    const q = "SELECT * FROM `"
                + tbl
                + "` WHERE `" + idCol + "` = '" + idVal + "'";
    return q;
}

// getRowsByCol
function getRowsByCol(tbl, col, val, sortCol = 'id', sortVal = 'ASC') {
    // SELECT * FROM `users` WHERE `status`='active' ORDER BY `id` ASC
    const q = "SELECT * FROM `"
                + tbl
                + "` WHERE `" + col + "` = '" + val + "' ORDER BY "
                + "`" + sortCol + "` " + sortVal;
    return q;
}

// getRowsList
function getRowsList(tbl, limit = false, offset = false, sortCol = 'id', sortVal = 'ASC') {
    // SELECT * FROM `users` ORDER BY `id` ASC LIMIT 100, 50
    const q = (limit && !offset)
                ? "SELECT * FROM `"
                + tbl
                + "` ORDER BY "
                + "`" + sortCol + "` " + sortVal + " LIMIT " + limit
                    : (limit && offset)
                    ? "SELECT * FROM `"
                    + tbl
                    + "` ORDER BY "
                    + "`" + sortCol + "` " + sortVal + " LIMIT " + limit + ", " + offset
                        : "SELECT * FROM `"
                        + tbl
                        + "` ORDER BY "
                        + "`" + sortCol + "` " + sortVal;
    return q;
}

// getDistinct
function getDistinct(col, tbl, sortCol = 'id', sortVal = 'ASC') {
    // SELECT DISTINCT `username` FROM `users` ORDER BY `id` ASC
    const q = "SELECT DISTINCT `" + col + "` FROM `"
                + tbl + "` ORDER BY "
                + "`" + sortCol + "` " + sortVal;
    return q;
}

// chkColInTbl
function chkColInTbl(tbl, col, val, noCol = false, noVal = false) {
    // SELECT * FROM `users` WHERE `username` = 'ruby'
    // SELECT * FROM `users` WHERE `username` = 'ruby' AND `username` != 'ruby'
    const q = (noCol && noVal)
                ? "SELECT * FROM `" + tbl + "` WHERE "
                + "`" + col + "` = '" + val + "' AND `"
                + noCol + "` != '" + noVal + "'"
                : "SELECT * FROM `" + tbl + "` WHERE "
                + "`" + col + "` = '" + val + "'";
    return q;
}
// getRowsByCols
function getRowsByCols(tbl, cols, noCols = false) {
    // SELECT * FROM `users` WHERE `username`=?
    // SELECT * FROM `users` WHERE `username`=? AND `username`!=?
    let colsVal = '';
    if (cols instanceof Array) {
        // Specifying the collumns
        for (i = 0; i < cols.length; i++) {
            colsVal += '`' + cols[i] + '`=?';
            if (i !== (cols.length - 1)) {
                colsVal += ' AND ';
            }
        }
    } else {
        colsVal = '`' + cols + '`=?';
    }

    let noColsVal = '';
    if (noCols instanceof Array) {
        // Specifying the collumns
        for (i = 0; i < noCols.length; i++) {
            noColsVal += '`' + noCols[i] + '`!=?';
            if (i !== (noCols.length - 1)) {
                noColsVal += ' AND ';
            }
        }
    } else {
        noColsVal = '`' + noCols + '`!=?';
    }

    const q = (noCols)
                ? "SELECT * FROM `" + tbl + "` WHERE " + colsVal + " AND " + noColsVal
                : "SELECT * FROM `" + tbl + "` WHERE " + colsVal;
    return q;
}

// updateSingleVal
function updateSingleVal(tbl, updateCol, updateVal, whereCol, whereVal) {
    // UPDATE `users` SET `status`='active' WHERE `id`='2'
    const q = "UPDATE `" + tbl + "` SET `" + updateCol + "` = '" + updateVal + "' WHERE `"
                + whereCol + "` = '" + whereVal + "'";
    return q;
}

module.exports = {
    insert,
    update,
    getRows,
    deleteRow,
    searchRows,
    getRowById,
    getRowsByCol,
    getRowsByCols,
    getRowsList,
    getDistinct,
    chkColInTbl,
    updateSingleVal
};
