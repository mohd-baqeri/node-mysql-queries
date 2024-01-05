/**
 * This small free software is a query builder of mysql for node or express JS developer
 * You can customize it for yourself to use with other DBMS
 * It's BEST for building API(s)!!!
 */

const { format } = require("date-fns"); // a dependency for node js (date-functions)

// addRow
function addRow(tbl, cols) {
  let colsVal = "";
  let colsCount = 0;
  if (cols instanceof Array) {
    // Specifying the collumns
    for (let i = 0; i < cols.length; i++) {
      colsVal += "`" + cols[i] + "`";
      if (i !== cols.length - 1) {
        colsVal += ", ";
      }
    }
    colsCount = cols.length;
  } else {
    colsVal = "`" + cols + "`";
    colsCount = 1;
  }

  // adding "?" to INSERT statement
  let qMark = "";
  for (let j = 0; j < colsCount; j++) {
    qMark += "?";
    if (j !== colsCount - 1) {
      qMark += ", ";
    }
  }

  // INSERT INTO `users` (`username`, `password`) VALUES (?, ?)
  const q =
    "INSERT INTO `" + tbl + "` (" + colsVal + ") VALUES (" + qMark + ")";
  return q;
}

// updateRow
function updateRow(tbl, updateCols, whereCols) {
  let updateColsVal = "";
  if (updateCols instanceof Array) {
    for (i = 0; i < updateCols.length; i++) {
      updateColsVal += "`" + updateCols[i] + "`=?";
      if (i !== updateCols.length - 1) {
        updateColsVal += ", ";
      }
    }
  } else {
    updateColsVal = "`" + updateCols + "`=?";
  }

  let whereColsVal = "";
  if (whereCols instanceof Array) {
    for (i = 0; i < whereCols.length; i++) {
      whereColsVal += "`" + whereCols[i] + "`=?";
      if (i !== whereCols.length - 1) {
        whereColsVal += " AND ";
      }
    }
  } else {
    whereColsVal = "`" + whereCols + "`=?";
  }

  // UPDATE `users` SET `username`=?, `password`=? WHERE `username`=? AND `password`=?
  const q =
    "UPDATE `" + tbl + "` SET " + updateColsVal + " WHERE " + whereColsVal;
  return q;
}

// deleteRow
function deleteRow(tbl, idCol, idVal, status = false) {
  // update the updated_at COLLUMN for specifying the 'delete time'
  const updated_at =
    "UPDATE `" +
    tbl +
    "` SET updated_at='" +
    format(new Date(), "yyyy-MM-dd HH:mm:ss") +
    "' WHERE `" +
    idCol +
    "` = '" +
    idVal +
    "'";

  // move the row to another table,
  const move_to_other_tbl =
    "INSERT INTO `" +
    tbl +
    "_deleted` SELECT * FROM `" +
    tbl +
    "` " +
    "WHERE `" +
    idCol +
    "` = '" +
    idVal +
    "'";

  // and then delete it
  const deleting =
    "DELETE FROM `" + tbl + "` WHERE `" + idCol + "` = '" + idVal + "'";

  // building the query
  const q =
    status == "updated_at"
      ? updated_at
      : status == "move"
      ? move_to_other_tbl
      : status == "delete"
      ? deleting
      : deleting;

  return q;
}

// getRows
function getRows(
  tbl,
  whereCols = false,
  whereNoCols = false,
  orderBy = false,
  limit = false,
  offset = false
) {
  // SELECT * FROM `users` WHERE `username`=? AND `username`!=?
  let colsVal = "";
  if (whereCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereCols.length; i++) {
      colsVal += "`" + whereCols[i] + "`=?";
      if (i !== whereCols.length - 1) {
        colsVal += " AND ";
      }
    }
  } else {
    colsVal = "`" + whereCols + "`=?";
  }

  let noColsVal = "";
  if (whereNoCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereNoCols.length; i++) {
      noColsVal += "`" + whereNoCols[i] + "`!=?";
      if (i !== whereNoCols.length - 1) {
        noColsVal += " AND ";
      }
    }
  } else {
    noColsVal = "`" + whereNoCols + "`!=?";
  }

  // query
  let query = "SELECT * FROM `" + tbl + "`";

  // where clause
  if (whereCols && whereNoCols) {
    query += " WHERE " + colsVal + " AND " + noColsVal;
  } else if (!whereCols && whereNoCols) {
    query += " WHERE " + noColsVal;
  } else if (whereCols && !whereNoCols) {
    query += " WHERE " + colsVal;
  }

  // orderBy
  if (orderBy) {
    query += " ORDER BY " + orderBy;
  }

  // limit
  if (limit && !offset) {
    query += " LIMIT " + limit;
  } else if (limit && offset) {
    query += " LIMIT " + limit + ", " + offset;
  }

  // finally return the query
  return query;
}

// getFirstRow
function getFirstRow(
  tbl,
  whereCols = false,
  whereNoCols = false,
  basedOn = "id"
) {
  // SELECT * FROM `user` ORDER BY `id` ASC LIMIT 1
  let colsVal = "";
  if (whereCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereCols.length; i++) {
      colsVal += "`" + whereCols[i] + "`=?";
      if (i !== whereCols.length - 1) {
        colsVal += " AND ";
      }
    }
  } else {
    colsVal = "`" + whereCols + "`=?";
  }

  let noColsVal = "";
  if (whereNoCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereNoCols.length; i++) {
      noColsVal += "`" + whereNoCols[i] + "`!=?";
      if (i !== whereNoCols.length - 1) {
        noColsVal += " AND ";
      }
    }
  } else {
    noColsVal = "`" + whereNoCols + "`!=?";
  }

  // query
  let query = "SELECT * FROM `" + tbl + "`";

  // where clause
  if (whereCols && whereNoCols) {
    query += " WHERE " + colsVal + " AND " + noColsVal;
  } else if (!whereCols && whereNoCols) {
    query += " WHERE " + noColsVal;
  } else if (whereCols && !whereNoCols) {
    query += " WHERE " + colsVal;
  }

  // basedOn
  if (basedOn) {
    query += " ORDER BY `" + basedOn + "` ASC LIMIT 1";
  }

  // finally return the query
  return query;
}

// getLastRow
function getLastRow(
  tbl,
  whereCols = false,
  whereNoCols = false,
  basedOn = "id"
) {
  // SELECT * FROM `user` ORDER BY `id` DESC LIMIT 1
  let colsVal = "";
  if (whereCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereCols.length; i++) {
      colsVal += "`" + whereCols[i] + "`=?";
      if (i !== whereCols.length - 1) {
        colsVal += " AND ";
      }
    }
  } else {
    colsVal = "`" + whereCols + "`=?";
  }

  let noColsVal = "";
  if (whereNoCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereNoCols.length; i++) {
      noColsVal += "`" + whereNoCols[i] + "`!=?";
      if (i !== whereNoCols.length - 1) {
        noColsVal += " AND ";
      }
    }
  } else {
    noColsVal = "`" + whereNoCols + "`!=?";
  }

  // query
  let query = "SELECT * FROM `" + tbl + "`";

  // where clause
  if (whereCols && whereNoCols) {
    query += " WHERE " + colsVal + " AND " + noColsVal;
  } else if (!whereCols && whereNoCols) {
    query += " WHERE " + noColsVal;
  } else if (whereCols && !whereNoCols) {
    query += " WHERE " + colsVal;
  }

  // basedOn
  if (basedOn) {
    query += " ORDER BY `" + basedOn + "` DESC LIMIT 1";
  }

  // finally return the query
  return query;
}

// getNextRows
function getNextRows(
  tbl,
  currentColName,
  currentColVal,
  whereCols = false,
  whereNoCols = false
) {
  // SELECT * FROM `user` WHERE `id` > 2 ORDER BY `id` ASC
  let colsVal = "";
  if (whereCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereCols.length; i++) {
      colsVal += "`" + whereCols[i] + "`=?";
      if (i !== whereCols.length - 1) {
        colsVal += " AND ";
      }
    }
  } else {
    colsVal = "`" + whereCols + "`=?";
  }

  let noColsVal = "";
  if (whereNoCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereNoCols.length; i++) {
      noColsVal += "`" + whereNoCols[i] + "`!=?";
      if (i !== whereNoCols.length - 1) {
        noColsVal += " AND ";
      }
    }
  } else {
    noColsVal = "`" + whereNoCols + "`!=?";
  }

  // query
  let query =
    "SELECT * FROM `" +
    tbl +
    "` WHERE `" +
    currentColName +
    "` > " +
    currentColVal;

  // where clause
  if (whereCols && whereNoCols) {
    query += " AND " + colsVal + " AND " + noColsVal;
  } else if (!whereCols && whereNoCols) {
    query += " AND " + noColsVal;
  } else if (whereCols && !whereNoCols) {
    query += " AND " + colsVal;
  }

  // orderBy
  query += " ORDER BY `" + currentColName + "` ASC";

  // finally return the query
  return query;
}

// getPrevRows
function getPrevRows(
  tbl,
  currentColName,
  currentColVal,
  whereCols = false,
  whereNoCols = false
) {
  // SELECT * FROM `user` WHERE `id` < 2 ORDER BY `id` DESC
  let colsVal = "";
  if (whereCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereCols.length; i++) {
      colsVal += "`" + whereCols[i] + "`=?";
      if (i !== whereCols.length - 1) {
        colsVal += " AND ";
      }
    }
  } else {
    colsVal = "`" + whereCols + "`=?";
  }

  let noColsVal = "";
  if (whereNoCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereNoCols.length; i++) {
      noColsVal += "`" + whereNoCols[i] + "`!=?";
      if (i !== whereNoCols.length - 1) {
        noColsVal += " AND ";
      }
    }
  } else {
    noColsVal = "`" + whereNoCols + "`!=?";
  }

  // query
  let query =
    "SELECT * FROM `" +
    tbl +
    "` WHERE `" +
    currentColName +
    "` < " +
    currentColVal;

  // where clause
  if (whereCols && whereNoCols) {
    query += " AND " + colsVal + " AND " + noColsVal;
  } else if (!whereCols && whereNoCols) {
    query += " AND " + noColsVal;
  } else if (whereCols && !whereNoCols) {
    query += " AND " + colsVal;
  }

  // orderBy
  query += " ORDER BY `" + currentColName + "` DESC";

  // finally return the query
  return query;
}

// getDistinctRows
function getDistinctRows(
  tbl,
  distinctCol,
  whereCols = false,
  whereNoCols = false,
  orderBy = false
) {
  // SELECT DISTINCT `email` FROM `user` WHERE `registered_on`=?
  let colsVal = "";
  if (whereCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereCols.length; i++) {
      colsVal += "`" + whereCols[i] + "`=?";
      if (i !== whereCols.length - 1) {
        colsVal += " AND ";
      }
    }
  } else {
    colsVal = "`" + whereCols + "`=?";
  }

  let noColsVal = "";
  if (whereNoCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereNoCols.length; i++) {
      noColsVal += "`" + whereNoCols[i] + "`!=?";
      if (i !== whereNoCols.length - 1) {
        noColsVal += " AND ";
      }
    }
  } else {
    noColsVal = "`" + whereNoCols + "`!=?";
  }

  // query
  let query = "SELECT DISTINCT `" + distinctCol + "` FROM `" + tbl + "`";

  // where clause
  if (whereCols && whereNoCols) {
    query += " WHERE " + colsVal + " AND " + noColsVal;
  } else if (!whereCols && whereNoCols) {
    query += " WHERE " + noColsVal;
  } else if (whereCols && !whereNoCols) {
    query += " WHERE " + colsVal;
  }

  // orderBy
  if (orderBy) {
    query += " ORDER BY " + orderBy;
  }

  // finally return the query
  return query;
}

// getRowMath (SUM, MAX, MIN, AVG, COUNT)
function getRowMath(
  tbl,
  math = "SUM",
  col = "id",
  whereCols = false,
  whereNoCols = false
) {
  // SELECT SUM(`salary`) AS `sum_salary` FROM `user` WHERE `registered_on`=?
  let colsVal = "";
  if (whereCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereCols.length; i++) {
      colsVal += "`" + whereCols[i] + "`=?";
      if (i !== whereCols.length - 1) {
        colsVal += " AND ";
      }
    }
  } else {
    colsVal = "`" + whereCols + "`=?";
  }

  let noColsVal = "";
  if (whereNoCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereNoCols.length; i++) {
      noColsVal += "`" + whereNoCols[i] + "`!=?";
      if (i !== whereNoCols.length - 1) {
        noColsVal += " AND ";
      }
    }
  } else {
    noColsVal = "`" + whereNoCols + "`!=?";
  }

  // query
  let query =
    "SELECT " +
    math +
    "(`" +
    col +
    "`) AS `" +
    math.toLowerCase() +
    "_" +
    col +
    "` FROM `" +
    tbl +
    "`";

  // where clause
  if (whereCols && whereNoCols) {
    query += " WHERE " + colsVal + " AND " + noColsVal;
  } else if (!whereCols && whereNoCols) {
    query += " WHERE " + noColsVal;
  } else if (whereCols && !whereNoCols) {
    query += " WHERE " + colsVal;
  }

  // finally return the query
  return query;
}

// searchRows
function searchRows(
  tbl,
  searchCol,
  searchVal,
  whereCols = false,
  whereNoCols = false,
  orderBy = false,
  limit = false,
  offset = false
) {
  // SELECT * FROM `user` WHERE `email` LIKE '%ali%' AND `registered_on`=?
  let colsVal = "";
  if (whereCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereCols.length; i++) {
      colsVal += "`" + whereCols[i] + "`=?";
      if (i !== whereCols.length - 1) {
        colsVal += " AND ";
      }
    }
  } else {
    colsVal = "`" + whereCols + "`=?";
  }

  let noColsVal = "";
  if (whereNoCols instanceof Array) {
    // Specifying the collumns
    for (i = 0; i < whereNoCols.length; i++) {
      noColsVal += "`" + whereNoCols[i] + "`!=?";
      if (i !== whereNoCols.length - 1) {
        noColsVal += " AND ";
      }
    }
  } else {
    noColsVal = "`" + whereNoCols + "`!=?";
  }

  // query
  let query =
    "SELECT * FROM `" +
    tbl +
    "` WHERE `" +
    searchCol +
    "` LIKE '%" +
    searchVal +
    "%'";

  // where clause
  if (whereCols && whereNoCols) {
    query += " AND " + colsVal + " AND " + noColsVal;
  } else if (!whereCols && whereNoCols) {
    query += " AND " + noColsVal;
  } else if (whereCols && !whereNoCols) {
    query += " AND " + colsVal;
  }

  // orderBy
  if (orderBy) {
    query += " ORDER BY " + orderBy;
  }

  // limit
  if (limit && !offset) {
    query += " LIMIT " + limit;
  } else if (limit && offset) {
    query += " LIMIT " + limit + ", " + offset;
  }

  // finally return the query
  return query;
}

// updateSingleVal
function updateSingleVal(tbl, updateCol, updateVal, whereCol, whereVal) {
  // UPDATE `users` SET `status`='active' WHERE `id`='2'
  const q =
    "UPDATE `" +
    tbl +
    "` SET `" +
    updateCol +
    "` = '" +
    updateVal +
    "' WHERE `" +
    whereCol +
    "` = '" +
    whereVal +
    "'";
  return q;
}

module.exports = {
  addRow,
  updateRow,
  deleteRow,
  getRows,
  getFirstRow,
  getLastRow,
  getNextRows,
  getPrevRows,
  getDistinctRows,
  getRowMath,
  searchRows,
  updateSingleVal,
};
