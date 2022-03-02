sudo mkdir -p /mnt/crypto/shard2
sudo chmod 777 /mnt/crypto/shard2
mongod --replSet shard2 --logpath "/mnt/crypto/shard2/log.log" --dbpath /mnt/crypto/shard2 --port 27002 --shardsvr &
