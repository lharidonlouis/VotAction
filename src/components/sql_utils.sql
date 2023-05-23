-- Add the codnua column to your table
ALTER TABLE app_elections.ER19_BVot
ADD COLUMN codnua VARCHAR(10);

SET SQL_SAFE_UPDATES = 0;

ALTER TABLE app_elections.ER19_BVot add column num_tour int;

UPDATE app_elections.ER19_BVot
SET num_tour = 1;

-- Update the codnua values based on the libelle_cand values
UPDATE app_elections.ER19_BVot
SET codnua = CASE 
  WHEN libelle_cand = 'LA FRANCE INSOUMISE' THEN 'LFI'
  WHEN libelle_cand = 'UNE FRANCE ROYALE' THEN 'LEXD'
  WHEN libelle_cand = 'LA LIGNE CLAIRE' THEN 'LEXD'
  WHEN libelle_cand = 'PARTI PIRATE' THEN 'LDIV'
  WHEN libelle_cand = 'RENAISSANCE' THEN 'LREM'
  WHEN libelle_cand = 'DÉMOCRATIE REPRÉSENTATIVE' THEN 'LDIV'
  WHEN libelle_cand = 'ENSEMBLE PATRIOTES' THEN 'LEXD'
  WHEN libelle_cand = 'PACE' THEN 'LDIV'
  WHEN libelle_cand = 'URGENCE ÉCOLOGIE' THEN 'LDVE'
  WHEN libelle_cand = 'LISTE DE LA RECONQUÊTE' THEN 'LEXD'
  WHEN libelle_cand = 'LES EUROPÉENS' THEN 'LDIV'
  WHEN libelle_cand = "ENVIE D'EUROPE" THEN 'LSOC'
  WHEN libelle_cand = 'PARTI FED. EUROPÉEN' THEN 'LDIV'
  WHEN libelle_cand = 'INITIATIVE CITOYENNE' THEN 'LDIV'
  WHEN libelle_cand = 'DEBOUT LA FRANCE' THEN 'LDLF'
  WHEN libelle_cand = 'ALLONS ENFANTS' THEN 'LDIV'
  WHEN libelle_cand = 'DÉCROISSANCE 2019' THEN 'LDIV'
  WHEN libelle_cand = 'LUTTE OUVRIÈRE' THEN 'LEXG'
  WHEN libelle_cand = "POUR L'EUROPE DES GENS" THEN 'LCOM'
  WHEN libelle_cand = 'ENSEMBLE POUR LE FREXIT' THEN 'LEXD'
  WHEN libelle_cand = 'LISTE CITOYENNE' THEN 'LGEN'
  WHEN libelle_cand = 'À VOIX ÉGALES' THEN 'LDIV'
  WHEN libelle_cand = 'PRENEZ LE POUVOIR' THEN 'LRN'
  WHEN libelle_cand = 'NEUTRE ET ACTIF' THEN 'LDIV'
  WHEN libelle_cand = 'RÉVOLUTIONNAIRE' THEN 'LEXG'
  WHEN libelle_cand = 'ESPERANTO' THEN 'LDIV'
  WHEN libelle_cand = 'ÉVOLUTION CITOYENNE' THEN 'LDIV'
  WHEN libelle_cand = 'ALLIANCE JAUNE' THEN 'LGJ'
  WHEN libelle_cand = 'UNION DROITE-CENTRE' THEN 'LUCD'
  WHEN libelle_cand = 'EUROPE ÉCOLOGIE' THEN 'LECO'
  WHEN libelle_cand = 'PARTI ANIMALISTE' THEN 'LDVE'
  WHEN libelle_cand = "LES OUBLIÉS DE L'EUROPE" THEN 'LDIV'
  WHEN libelle_cand = "UDLEF" THEN 'LDIV'
  WHEN libelle_cand = "EUROPE AU SERVICE PEUPLES" THEN 'LDIV'
  ELSE "NC"
  END;
  


SELECT sum(voix) FROM app_elections.LG22_BVot_T1T2 where code_departement = 95 and code_commune = 127 and code_bvote = 0001 and (codnua = "DVG" or codnua = "NUP");



SELECT 'LG22_BVot_T1T2' AS table_name, SUM(voix) AS total_sum
FROM app_elections.LG22_BVot_T1T2
WHERE code_departement = 95 AND code_commune = 127 AND code_bvote = 0001
AND codnua IN ("DVG", "NUP", "SOC")
UNION
SELECT 'LG17_BVot_T1T2' AS table_name, SUM(voix) AS total_sum
FROM app_elections.LG17_BVot_T1T2
WHERE code_departement = 95 AND code_commune = 127 AND code_bvote = 0001
AND codnua IN ("DVG", "NUP", "SOC");







SELECT table_name, SUM(total_sum) AS s_voix, SUM(exprimes) AS exprimes
FROM (
  SELECT 'LG22_BVot_T1T2' AS table_name, code_bvote, SUM(voix) AS total_sum, MAX(exprimes) AS exprimes
  FROM app_elections.LG22_BVot_T1T2
  WHERE code_departement = 95 AND code_commune = 127 AND num_tour = 1 AND code_bvote = 0001
  AND codnua IN ('DVG', 'NUP', 'SOC')
  GROUP BY table_name, code_bvote
  UNION
  SELECT 'LG17_BVot_T1T2' AS table_name, code_bvote, SUM(voix) AS total_sum, MAX(exprimes) AS exprimes
  FROM app_elections.LG17_BVot_T1T2
  WHERE code_departement = 95 AND code_commune = 127 AND num_tour = 1 AND code_bvote = 0001
  AND codnua IN ('DVG', 'NUP', 'SOC')
  GROUP BY table_name, code_bvote
) AS subquery
GROUP BY table_name;
