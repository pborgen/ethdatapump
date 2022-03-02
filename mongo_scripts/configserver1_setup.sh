mkdir -p /mnt/crypto/configserver1
sudo mongod --logpath "" --dbpath /mnt/crypto/configserver1 --replSet conf --port 27001 --fork --configsvr --smallfiles