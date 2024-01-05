-- BookShop 스키마
CREATE SCHEMA `BookShop` DEFAULT CHARACTER SET utf8 ;

-- users 테이블
CREATE TABLE `BookShop`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(320) NOT NULL,
  `password` VARCHAR(64) NOT NULL,
  `salt` VARCHAR(64) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);

-- books 테이블
CREATE TABLE `BookShop`.`books` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `img` INT,
  `category_id` INT NOT NULL,
  `from` VARCHAR(45) NOT NULL,
  `isbn` VARCHAR(45) NOT NULL,
  `summary` VARCHAR(500) NULL,
  `detail` LONGTEXT NULL,
  `author` VARCHAR(45) NULL,
  `pages` INT NOT NULL,
  `contents` LONGTEXT NULL,
  `price` INT NOT NULL,
  `pub_date` DATE NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `isbn_UNIQUE` (`isbn` ASC) VISIBLE);

-- category 테이블
CREATE TABLE `BookShop`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`));

-- 왜래키 설정
ALTER TABLE `BookShop`.`books` 
ADD INDEX `category_id_idx` (`category_id` ASC) VISIBLE;
;
ALTER TABLE `BookShop`.`books` 
ADD CONSTRAINT `category_id`
  FOREIGN KEY (`category_id`)
  REFERENCES `BookShop`.`category` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


-- books 테이블 데이터
INSERT INTO `BookShop`.`books` (`title`, `img`, `category_id`, `form`, `isbn`, `summary`, `detail`, `author`, `pages`, `contents`, `price`, `pub_date`) VALUES ('어린왕자들', '7', '0', '종이책', '0', '어리다', '많이어리다', '김어림', '100', '목차입니다', '20000', '2019-01-01');
INSERT INTO `BookShop`.`books` (`title`, `img`, `category_id`, `form`, `isbn`, `summary`, `detail`, `author`, `pages`, `contents`, `price`, `pub_date`) VALUES ('신데렐라들', '10', '0', '종이책', '1', '유리구두', '투명한 유리구두..', '김구두', '100', '목차입니다', '20000', '2023-12-01');
INSERT INTO `BookShop`.`books` (`title`, `img`, `category_id`, `form`, `isbn`, `summary`, `detail`, `author`, `pages`, `contents`, `price`, `pub_date`) VALUES ('백설공주들', '60', '1', '종이책', '2', '사과', '빨간 사과...', '김사과', '100', '목차입니다', '20000', '2023-12-20');
INSERT INTO `BookShop`.`books` (`title`, `img`, `category_id`, `form`, `isbn`, `summary`, `detail`, `author`, `pages`, `contents`, `price`, `pub_date`) VALUES ('흥부와 놀부들', '90', '2', '종이책', '3', '제비...', '까만 제비...', '김제비', '100', '목차입니다', '20000', '2023-12-31');

-- category 테이블 데이터
INSERT INTO `BookShop`.`category` (`id`, `name`) VALUES ('0', '동화');
INSERT INTO `BookShop`.`category` (`id`, `name`) VALUES ('1', '소설');
INSERT INTO `BookShop`.`category` (`id`, `name`) VALUES ('2', '사회');
