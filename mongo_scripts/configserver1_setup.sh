sudo mkdir -p /mnt/crypto/mongodb/configserver1
sudo chmod 777 /mnt/crypto/mongodb/configserver1
sudo mongod --logpath "/mnt/crypto/configserver1/log.log" --dbpath /mnt/crypto/mongodb/configserver1 --replSet conf --port 27011  --configsvr &