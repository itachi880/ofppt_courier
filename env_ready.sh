#!/bin/bash

# Update package lists
echo "🔄 Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Apache
echo "🔧 Installing Apache..."
sudo apt install apache2 -y
sudo systemctl enable apache2
sudo systemctl start apache2

# Install MySQL
echo "🔧 Installing MySQL..."
sudo apt install mysql-server -y
sudo systemctl enable mysql
sudo systemctl start mysql

# Secure MySQL installation (automated)
echo "🔒 Securing MySQL..."
read -sp "Enter a password for the MySQL root user: " MYSQL_ROOT_PASS
echo  # Moves to a new line after password input

# Check if the password is provided
if [ -z "$MYSQL_ROOT_PASS" ]; then
  echo "❌ No password provided for MySQL root. Exiting."
  exit 1
fi

# Secure MySQL root user with the password provided
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASS'; FLUSH PRIVILEGES;"
sudo systemctl restart mysql

# Install PHP and necessary modules
echo "🔧 Installing PHP and required modules..."
sudo apt install php libapache2-mod-php php-mysql php-cli php-curl php-xml php-mbstring -y

# Restart Apache to apply PHP support
echo "🔄 Restarting Apache..."
sudo systemctl restart apache2

# Install phpMyAdmin
echo "🔧 Installing phpMyAdmin..."
sudo apt install phpmyadmin -y

# Configure Apache to work with phpMyAdmin
echo "🔧 Configuring Apache for phpMyAdmin..."
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
sudo systemctl restart apache2

# IMPORT DATABASE
echo "🔄 Importing database..."
mysql -u root -p"$MYSQL_ROOT_PASS" < ./ofppt_couriers.sql

# Install Node.js 18.x and npm
echo "🔧 Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs npm 
sudo rm -f ./back_end/package-lock.json
sudo rm -f ./front_end/package-lock.json

# Verify installations
echo "✅ Verifying installations..."
apache2 -v
mysql --version
php -v
node -v
npm -v

# Move source directories
echo "🔄 Moving source directories..."

# Ensure /courrier and subdirectories exist
mkdir -p /courrier/front_end
mkdir -p /courrier/back_end

# Moving the 'back_end' directory and its contents
if [ -d ./back_end ]; then
  echo "✅ Moving 'back_end' directory..."

  # Move the .env file separately (you can add more hidden files if needed)
  mv ./back_end/.env /courrier/back_end

  # Ensure hidden files and all files are moved by enabling dotglob
  shopt -s dotglob
  mv ./back_end/* /courrier/back_end   # Move all files including hidden ones
  shopt -u dotglob   # Disable dotglob to avoid affecting other patterns

else
  echo "❌ 'back_end' directory not found! Listing contents of the current directory:"
  ls -l
  exit 1
fi

# Moving the 'front_end' directory and its contents
if [ -d ./front_end ]; then
  echo "✅ Moving 'front_end' directory..."
  
  # Ensure hidden files and all files are moved
  shopt -s dotglob
  mv ./front_end/* /courrier/front_end   # Move all files including hidden ones
  shopt -u dotglob   # Disable dotglob to avoid affecting other patterns

else
  echo "❌ 'front_end' directory not found! Listing contents of the current directory:"
  ls -l
  exit 1
fi

# Install project dependencies
echo "📦 Installing project dependencies..."

# Backend dependencies
if [ -d /courrier/back_end ]; then
  cd /courrier/back_end || { echo "❌ Backend directory not found!"; exit 1; }
  npm install
else
  echo "❌ Backend directory is missing. Exiting."
  exit 1
fi

# Frontend dependencies
if [ -d /courrier/front_end ]; then
  cd /courrier/front_end || { echo "❌ Frontend directory not found!"; exit 1; }
  npm install
else
  echo "❌ Frontend directory is missing. Exiting."
  exit 1
fi

# Test MySQL connection
echo "✅ Testing MySQL connection..."
node /courrier/back_end/test_db.js "$MYSQL_ROOT_PASS"

# Setting up auto-start for the backend using systemd
echo "🎯 Setting up auto-start for the backend using systemd..."

SERVICE_NAME="auto_launch_backend.service"

# Check if the systemd service already exists
if systemctl list-units --type=service | grep -q "$SERVICE_NAME"; then
  echo "⚠️ Service '$SERVICE_NAME' already exists. Skipping creation."
else
  # Create systemd service unit file if it doesn't exist
  sudo tee /etc/systemd/system/$SERVICE_NAME > /dev/null <<EOF
[Unit]
Description=Auto Launch Backend on Boot
After=network.target

[Service]
ExecStart=/usr/bin/node /courrier/back_end/index.js   # Lancer Node directement
WorkingDirectory=/courrier/back_end
Restart=always
StandardOutput=append:/var/log/backend.log
StandardError=append:/var/log/backend.log
[Install]
WantedBy=multi-user.target

EOF

  # Reload systemd to apply the new service
  sudo systemctl daemon-reload

  # Enable the service to run on boot
  sudo systemctl enable $SERVICE_NAME

  # Start the service immediately (optional)
  sudo systemctl start $SERVICE_NAME

  echo "✅ Auto-start set up using systemd."
fi

echo "✅ Setup complete! Your web environment is ready."
