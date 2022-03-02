mkdir -p /mnt/crypto/configserver1
sudo mongod --logpath "/mnt/crypto/configserver1/log.log" --dbpath /mnt/crypto/configserver1 --replSet conf --port 27011  --configsvr