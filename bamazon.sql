DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT, 
    product_name VARCHAR(40) NULL, 
    department_name VARCHAR(60) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT NULL,
    PRIMARY KEY (id)
);