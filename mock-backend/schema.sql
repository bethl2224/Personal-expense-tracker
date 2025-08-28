CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    user_budget INT
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount INT NOT NULL,
    date DATE NOT NULL,
    description VARCHAR(500),
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);


-- USERS
INSERT INTO users (user_id, name, email, user_budget) VALUES
(1, 'Alice Johnson', 'alice.johnson@example.com', 2000),
(2, 'Bob Smith', 'bob.smith@example.com', 3000),
(3, 'Charlie Lee', 'charlie.lee@example.com', 4000),
(4, 'Diana Brown', 'diana.brown@example.com', 3500),
(5, 'Ethan Davis', 'ethan.davis@example.com', 4500);

-- CATEGORIES
INSERT INTO categories (category_id, name) VALUES
(1, 'Groceries'),
(2, 'Entertainment'),
(3, 'Transportation'),
(4, 'Utilities'),
(5, 'Rent'),
(6, 'Salary'),
(7, 'Bills');

-- TRANSACTIONS
INSERT INTO transactions (transaction_id, user_id, category_id, amount, date, description, type) VALUES
(1, 1, 6, 2000, '2025-08-01', 'Salary', 'income'),
(2, 1, 2, 50, '2025-08-03', 'Movie night with friends', 'expense'),
(3, 1, 3, 30, '2025-08-05', 'Taxi fare to office', 'expense'),
(4, 1, 3, 30, '2025-08-11', 'Taxi fare to water park', 'expense'),
(5, 2, 4, 90, '2025-08-02', 'Grocery shopping at Target', 'expense'),
(6, 2, 5, 60, '2025-08-04', 'Electricity bill', 'expense'),
(7, 2, 6, 25, '2025-08-06', 'Gym membership fee', 'expense'),
(8, 3, 7, 1500, '2025-08-01', 'Monthly rent payment', 'expense');
