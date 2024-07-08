DROP PROCEDURE AlmacenarReceta
CREATE PROCEDURE AlmacenarReceta(
    IN p_tag VARCHAR(255),
    IN p_title varchar(100),
	IN p_description text, 
	IN p_picture varchar(300),
    IN p_idusuario INT
)
BEGIN
    DECLARE id_tag_existente INT;
    DECLARE id_receta INT;
    SELECT idTags INTO id_tag_existente
    FROM Tags
    WHERE name = p_tag

    IF id_tag_existente IS NULL THEN
        INSERT INTO Tags (name)
        VALUES (p_tag);
        SET id_tag_existente = LAST_INSERT_ID();
    END IF;

    INSERT INTO Recetas (title, picture,description,Users_idUser)
    VALUES (p_title, p_picture,p_description,p_idusuario);


    SET id_receta = LAST_INSERT_ID();

    -- Asociar la foto al álbum
    INSERT INTO Detalles (Tag_idTags, Recetas_idReceta)
    VALUES (id_tag_existente, id_receta);
END 


DROP PROCEDURE AgregarTag
CREATE PROCEDURE AgregarTag(
    IN p_tag VARCHAR(255),
    IN p_idusuario INT
)
BEGIN
    DECLARE id_tag_existente INT;
    DECLARE id_receta INT;
    SELECT idTags INTO id_tag_existente
    FROM Tags
    WHERE name = p_tag
    IF id_tag_existente IS NULL THEN
        INSERT INTO Tags (name)
        VALUES (p_tag);
        SET id_tag_existente = LAST_INSERT_ID();
    END IF;

    SELECT MAX(idReceta) into id_receta FROM Recetas;

    INSERT INTO Detalles (Tag_idTags, Recetas_idReceta)
    VALUES (id_tag_existente, id_receta);
END 



