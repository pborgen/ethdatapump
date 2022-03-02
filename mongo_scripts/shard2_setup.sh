sudo mkdir -p /mnt/crypto/mongodb/shard2
sudo chmod 777 /mnt/crypto/mongodb/shard2
mongod --replSet shard2 --logpath "/mnt/crypto/mongodb/shard2/log.log" --dbpath /mnt/crypto/mongodb/shard2 --port 27002 --shardsvr &
