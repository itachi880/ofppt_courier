#!/bin/bash

# Update package lists
echo "Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Apache
echo "Installing Apache..."
sudo apt install apache2 -y
sudo systemctl enable apache2
sudo systemctl start apache2

# Install MySQL
echo "Installing MySQL..."
sudo apt install mysql-server -y
sudo systemctl enable mysql
sudo systemctl start mysql
# Secure MySQL installation (automated)
echo "Securing MySQL..."
read -sp "Enter a password for the MySQL root user: " MYSQL_ROOT_PASS
echo  # Moves to a new line after password input

# Secure MySQL installation with the provided password
echo "Setting MySQL root password..."

# Configure phpMyAdmin to allow root login
echo "Configuring phpMyAdmin to use root user..."
echo "[mysqld]" | sudo tee -a /etc/mysql/my.cnf
echo "skip-grant-tables" | sudo tee -a /etc/mysql/my.cnf
sudo systemctl restart mysql

# Remove restrictions on root login
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASS'; FLUSH PRIVILEGES;"

# Remove skip-grant-tables to re-enable security
sudo sed -i '/skip-grant-tables/d' /etc/mysql/my.cnf
sudo systemctl restart mysql
# Install PHP and necessary modules
echo "Installing PHP..."
sudo apt install php libapache2-mod-php php-mysql php-cli php-curl php-xml php-mbstring -y

# Restart Apache to apply PHP support
echo "Restarting Apache..."
sudo systemctl restart apache2

# Install phpMyAdmin
echo "Installing phpMyAdmin..."
sudo apt install phpmyadmin -y

# Configure Apache to work with phpMyAdmin
echo "Configuring Apache for phpMyAdmin..."
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
sudo systemctl restart apache2

# Install Node.js 18.20.5 and npm 10
echo "Installing Node.js 18.20.5 and npm 10..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g npm@10
sudo rm ./back_end/package-lock.json
sudo rm ./front_end/package-lock.json
# Verify installations
echo "Verifying installations..."
apache2 -v
mysql --version
php -v
node -v
npm -v

echo "Installing project dependencies..."

cd ./back_end
npm i 
cd ../front_end
npm i
cd ../back_end
echo "✅ test the mysql connection..."
node ./test_db.js
cd ..
echo "✅ Setup complete! Your web environment is ready."
