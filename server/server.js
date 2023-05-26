const express = require('express');
const mysql = require('mysql');



const app = express();

const cors = require('cors');

app.use(cors());


const elections = [
  'ER99_Bvot',
  'CN01_BVot_T1T2',
  'LG02_BVot_T1T2',
  'CN04_BVot_T1T2',
  'RG04_BVot_T1T2',
  'ER04_BVot',
  'LG07_Bvot_T1T2',
  'CN08_BVot_T1T2',
  'ER09_BVOT',
  'RG10_BVot_T1T2',
  'CN11_BVot_T1T2',
  'LG12_Bvot_T1T2',
  'ER14_BVOT',
  'RG15_BVot_T1T2',
  'DP15_Bvot_T1T2',
  'LG17_BVot_T1T2',
  'ER19_BVot',
  'DP21_BVot_T1T2',
  'RG21_BVot_T1T2',
  'LG22_BVot_T1T2',
];

  

  Nuances = {
    "EXG": "Extrême Gauche",
    "DIV": "Divers",
    "MNA": "Mouvement National",
    "VEC": "Les Verts",
    "GAU": "Gauche",
    "COM": "Communiste",
    "UDF": "Union pour la Démocratie Française",
    "CPNT": "Chasse, Pêche, Nature, Tradition",
    "FRN": "Front National",
    "REG": "Régionaliste",
    "DTE": "Droite",
    "ECO": "Écologiste",
    "DVD": "Divers Droite",
    "MNR": "Mouvement National Républicain",
    "FN": "Front National",
    "DVG": "Divers Gauche",
    "DL": "Droite Libérale",
    "SOC": "Socialiste",
    "RPR": "Rassemblement pour la République",
    "MDC": "Mouvement des Citoyens",
    "PRG": "Parti Radical de Gauche",
    "RPF": "Rassemblement du Peuple Français",
    "UMP": "Union pour un Mouvement Populaire",
    "PREP": "NON CONNU",
    "MPF": "Mouvement pour la France",
    "LO": "Lutte Ouvrière",
    "LCR": "Ligue Communiste Révolutionnaire",
    "EXD": "Extrême Droite",
    "RDG": "Rassemblement de Gauche",
    "LFN": "Lutte Front National",
    "LXG": "Liste Extrême Gauche",
    "LGA": "Liste de Gauche",
    "LVE": "Liste des Verts",
    "LDR": "Liste Droite",
    "LXD": "Liste Extrême Droite",
    "LDV": "Liste Divers",
    "LEC": "La République en Marche",
    "LDD": "Liste Divers Droite",
    "LCP": "Listes Chasse,pêche,nature et traditions",
    "LDG": "Listes divers gauche",
    "LRG": "Listes régionaliste",
    "AUT": "Autre",
    "LAUT": "Liste Autre",
    "LDVD": "Liste Divers Droite",
    "LDVG": "Liste Divers Gauche",
    "LEXG": "Liste Extrême Gauche",
    "LVEC": "Liste Les Verts",
    "LSOC": "Liste Socialiste",
    "LCOP": "Liste Communiste",
    "LCMD": "Liste Centriste Modem",
    "LMAJ": "Liste Majorité Présidentielle",
    "LEXD": "Liste Extrême Droite",
    "LREG": "Liste Régionaliste",
    "LUG": "Liste Union de la Gauche",
    "PG": "Parti de Gauche",
    "MNC": "Majorité Présidentielle",
    "MODM": "Modem",
    "MAJ": "Majorité",
    "LDIV": "Liste Divers",
    "LFG": "Liste Front de Gauche",
    "LUC": "Liste Union du Centre",
    "LCOM": "Liste Communiste",
    "LVEG": "Liste Verts Écologistes",
    "LDLF": "Liste Debout la France",
    "LUD": "Liste Union de la Droite",
    "LECO": "Liste Écologiste",
    "LLR": "Liste Les Républicains",
    "LRDG": "Liste Radicaux de Gauche",
    "LMDM": "Liste Modem",
    "LUDI": "Liste UDI",
    "BC-UG": "Binôme de Gauche",
    "BC-FN": "Binôme Front National",
    "BC-UD": "Binôme Union de la Droite",
    "BC-VEC": "Binôme Les Verts Écologistes",
    "BC-COM": "Binôme Communiste",
    "BC-DVD": "Binôme Divers Droite",
    "BC-DIV": "Binôme Divers",
    "BC-UMP": "Binôme UMP",
    "BC-DVG": "Binôme Divers Gauche",
    "BC-SOC": "Binôme Socialiste",
    "BC-UDI": "Binôme UDI",
    "BC-FG": "Binôme Front de Gauche",
    "BC-EXG": "Binôme Extrême Gauche",
    "BC-RDG": "Binôme Rassemblement de Gauche",
    "BC-DLF": "Binôme Debout la France",
    "BC-EXD": "Binôme Extrême Droite",
    "BC-MDM": "Binôme Modem",
    "BC-PG": "Binôme Parti de Gauche",
    "BC-UC": "Binôme Union du Centre",
    "FI": "France Insoumise",
    "REM": "La République En Marche",
    "UDI": "Union des Démocrates et Indépendants",
    "LR": "Les Républicains",
    "DLF": "Debout la France",
    "MDM": "Modem",
    "BC-UCD": "Binôme d'union au centre et à droite	",
    "BC-RN": "Binôme Rassemblement National",
    "BC-UXD": "Binôme Union Extrême Droite",
    "BC-UGE": "Binôme Union de la Gauche et des Écologistes",
    "BC-DSV": "Binôme Debout Sud-Vienne",
    "BC-LR": "Binôme Les Républicains",
    "BC-DVC": "Binôme Divers Centre",
    "BC-UCG": "Binôme Union du Centre et Gauche",
    "BC-REM": "Binôme La République En Marche",
    "BC-FI": "Binôme France Insoumise",
    "BC-ECO": "Binôme Écologiste",
    "BC-REG": "Binôme Régionaliste",
    "BC-GJ": "Binôme Gilets jaunes",
    "LRN": "Lutte Rassemblement National",
    "LDSV": "Listes souverainistes de droite",
    "LUGE": "Liste Union de la Gauche Écologiste",
    "LDVC": "Liste Divers Centre",
    "LUCD": "Liste d'union au centre et à droite	",
    "LFI": "Liste La France Insoumise",
    "LREM": "Liste La République En Marche",
    "DXG": "Divers Extrême Gauche",
    "NUP": "Nouvelle Union Populaire Écologique et Sociale",
    "ENS": "Ensemble",
    "DVC": "Divers Centre",
    "DSV": "Divers souverainistes",
    "REC": "Rassemblement Écologiste et Citoyen",
    "RN": "Rassemblement National",
    "DXD": "Divers Extrême Droite"  
  }


  

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'db_user!2023',
  database: 'app_elections',
  port: 3306
});


app.get('/api/distinctCodnua', (req, res) => {
  const query = elections.map((election) => `(SELECT DISTINCT codnua FROM ${election})`).join(' UNION ');
  console.log(query);

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing SQL query:', error);
      return res.status(500).json({ error: 'An error occurred' });
    }

    const distinctCodnuaSet = new Set();

    results.forEach((result) => {
      const codnua = result.codnua.trim().replace('M-NC', 'MNC'); // Replace 'M-NC' with 'MNC'
      if (codnua !== '') {
        distinctCodnuaSet.add(codnua);
      }
    });

    const distinctCodnua = Array.from(distinctCodnuaSet);

    return res.json({ distinctCodnua });
  });
});

app.get('/api/natio_codnua', (req, res) => {
    const elections = req.query.elections;
    console.log(elections);
    const sql = `SELECT num_tour, codnua, SUM(voix) as total FROM app_elections.${elections} GROUP BY codnua, num_tour ORDER BY total ASC;`;
    console.log(sql);
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/chartData', (req, res) => {
    const elections = req.query.elections;
    const sql = `SELECT num_tour, codnua, SUM(voix) as total FROM app_elections.${elections} GROUP BY codnua, num_tour ORDER BY total ASC`;
    connection.query(sql, (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
  });


  app.get('/api/chartData2', (req, res) => {
    const data = [];
    let progress = 0;
  
    for (const table of elections) {
      const sql = `SELECT '${table}' as table_name, num_tour, codnua, SUM(voix) as total FROM app_elections.${table} GROUP BY codnua, num_tour ORDER BY total ASC`;
      connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        data.push(...results);
        progress++;
  
        if (progress === elections.length) {
          res.json(data);
        } else {
          const percentage = Math.floor((progress / elections.length) * 100);
          console.log(`Progress: ${progress}/${elections.length} (${percentage}%)`);
        }
      });
    }
  });
    


  app.get('/api/chartData3', (req, res) => {
    const numTables = elections.length;
    let completedTables = 0;
    const data = [];
  
    elections.forEach((table) => {
      const sql = `SELECT '${table}' as table_name, num_tour, codnua, SUM(voix) as total FROM app_elections.${table} GROUP BY codnua, num_tour ORDER BY total ASC`;
      const query = connection.query(sql);
  
      query.on('error', (err) => {
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
  
      query.on('result', (row) => {
        data.push({ table, ...row });
      });
  
      query.on('end', () => {
        completedTables++;
        if (completedTables === numTables) {
          res.json(data);
        }
      });
    });
  });
  
  


app.get('/api/villes', (req, res) => {
    const dept = req.query.dept;
    var sql = "";
    const elections = req.query.elections;
    const elec = elections.replace(/"/g, '');
    if(dept){
        sql = `SELECT DISTINCT libelle_commune, code_commune FROM app_elections.${elec} WHERE code_departement = ` + dept; 
    }
    else{
        sql = `SELECT DISTINCT libelle_commune, code_commune FROM app_elections.${elec}`;
    }
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
});


app.get('/api/inscrits_ville', (req, res) => {

  sql = `SELECT code_bvote, inscrits FROM app_elections.RG15_BVot_T1T2 WHERE code_departement = 95 AND code_commune = 127 GROUP BY code_bvote, inscrits;`;

});

app.get('/api/bdv', (req, res) => {
    const code_departement = req.query.code_departement;
    const code_commune = req.query.code_commune;
    const elections = req.query.elections;
    const elec = elections.replace(/"/g, '');
    const sql = `SELECT DISTINCT code_bvote FROM app_elections.${elec} WHERE code_departement = ${code_departement} and code_commune = ${code_commune} ORDER BY code_bvote ASC`;
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


app.get('/api/bdv_info', (req, res) => {
  const code_departement = req.query.code_departement;
  const code_commune = req.query.code_commune;
  const bdv = req.query.bdv;

  const id = code_departement.concat(code_commune);

  const sql = `SELECT * FROM app_elections.2022_bvotes where commune_code = ${id} and code_normalise_complet= ${bdv}`;

  console.log(sql);
  connection.query(sql, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(results);
  });
});


app.get('/api/bdv_noms', (req, res) => {
  const code_departement = req.query.code_departement;
  const code_commune = req.query.code_commune;

  const id = code_departement.concat(code_commune);

  // const sql = `SELECT code_normalise_complet, nom FROM app_elections.2022_bvotes where commune_code = ${id}`;
  const sql = `SELECT * FROM app_elections.2022_bvotes where commune_code = ${id}`;

  console.log(sql);
  connection.query(sql, (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(results);
  });
});



app.get('/api/tables', (req, res) => {
    const sql = 'SHOW TABLES FROM app_elections;';
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  

app.get('/api/dept', (req, res) => {
    var sql = "";
    sql = "SELECT DISTINCT code_departement, libelle_departement FROM app_elections.LG22_BVot_T2 ORDER BY code_departement ASC";
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
});

app.get('/api/data', (req, res) => {
    const code_departement = req.query.code_departement;
    const code_commune = req.query.code_commune;
    const elections = req.query.elections;
    const elec = elections.replace(/"/g, '');
    const sql = `SELECT * FROM app_elections.${elec} WHERE code_departement = ${code_departement} and code_commune = ${code_commune}`;
    console.log(sql);
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
});

app.get('/api/inscrits', (req, res) => {
  const code_departement = req.query.code_departement;
  const code_commune = req.query.code_commune;
  const code_bvote = req.query.code_bvote;

  const getInscrits = () => {
    return new Promise((resolve, reject) => {
      const queries = elections.map((election) => {
        return `SELECT '${election}' as "name", inscrits FROM app_elections.${election} WHERE code_departement = ${code_departement} and code_commune = ${code_commune} and code_bvote = ${code_bvote}`;
      });

      const sql = queries.join(' UNION ');
      // console.log(sql);

      connection.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };


  

  const fetchInscrits = async () => {
    try {
      const result = await getInscrits();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  fetchInscrits();
});

app.get('/api/res_nua', (req, res) => {
  const code_departement = req.query.code_departement;
  const code_commune = req.query.code_commune;
  const code_bvote = req.query.code_bvote? req.query.code_bvote : -1;
  const codnuas = req.query.codnuas; // Nouveau paramètre codnuas
  
  const get_voix = () => {
    return new Promise((resolve, reject) => {
      const codnuaConditions = codnuas.split(',').map((codnua) => `codnua = "${codnua.trim()}"`).join(' OR ');


let queries;
let sql;
if (code_bvote == -1) {
  queries = elections.map((election) => {
    return `SELECT '${election}' AS "name", code_bvote, SUM(voix) AS total_sum, MAX(exprimes) AS exprimes FROM app_elections.${election} WHERE code_departement = ${code_departement} AND code_commune = ${code_commune} AND num_tour = 1 AND (${codnuaConditions}) GROUP BY name, code_bvote`;
  });
   sql = `SELECT name,   CASE WHEN SUM(total_sum) IS NULL THEN NULL ELSE SUM(total_sum) END AS s_voix, SUM(exprimes) AS exprimes FROM (${queries.join(
    ' UNION '
  )}) AS subquery GROUP BY name`;
  
} else {
  queries = elections.map((election) => {
    return `SELECT '${election}' as "name", sum(voix) as "s_voix", max(exprimes) as exprimes FROM app_elections.${election} WHERE code_departement = ${code_departement} and code_commune = ${code_commune} and code_bvote = ${code_bvote} and (${codnuaConditions}) and num_tour = 1`;
  });
   sql = queries.join(' UNION ');
}
//console.log(sql);


      // console.log(sql);

      connection.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };


  const fecthVoix = async () => {
    try {
      const result = await get_voix();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  fecthVoix();
});


app.get('/api/data_bdv', (req, res) => {
    const code_departement = req.query.code_departement;
    const code_commune = req.query.code_commune;
    const code_bvote = req.query.code_bvote;
    const elections = req.query.elections;
    const elec = elections.replace(/"/g, '');
    const sql = `SELECT * FROM app_elections.${elec} WHERE code_departement = ${code_departement} and code_commune = ${code_commune} and code_bvote = ${code_bvote}`;
    console.log(sql);
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
});



app.get('/api/res_ville_codnua', (req, res) => {
    const code_departement = req.query.code_departement;
    const code_commune = req.query.code_commune;
    const sql = `SELECT * FROM app_elections.LG22_BVot_T1T2 WHERE code_departement = ${code_departement} and code_commune = ${code_commune}`;
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
});
  
  

const PORT = 3005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
