#!/usr/bin/env bash

HOST='dispatchresponse.cyqnwvgizc2j.us-east-1.rds.amazonaws.com'
DBNAME='gfddispatch'
DBUSER='webapplogin'
FILE_NAME="gfddispatch_db-`date +%Y%m%d-%H%M`.sql.gz"
SAVE_DIR='/home/ubuntu/gfddispatch/scripts'
S3BUCKET='dispatchresponse'
S3BUCKET_FOLDER='backups'

source /home/ubuntu/gfddispatch/.env

PGPASSWORD=$DB_PG_PASSWD pg_dump -h $HOST -p 5432 -U $DBUSER -d $DBNAME | gzip > $SAVE_DIR/$FILE_NAME

if [ -e $SAVE_DIR/$FILE_NAME ]; then
  # Upload to AWS S3
  aws s3 cp $SAVE_DIR/$FILE_NAME s3://$S3BUCKET/$S3BUCKET_FOLDER/$FILE_NAME

  # Test result of last command
  if [ "$?" -ne "0" ]; then
    echo "Upload to AWS S3 failed"
    exit 1
  fi

  # If success, remove the backup file from server
  rm $SAVE_DIR/$FILE_NAME

  # Exit with no error
  exit 0
fi

# Exit with error if we reach this point
echo "Backup file was not created"
exit 1

# Make a cron entry in /etc/cron.d/gfddispatch-DB-backup
#
# -----
# /etc/cron.d/gfddispatch-DB-backup: crontab entries for backing up the database on RDS for gfddispatch
#
# SHELL=/bin/sh
# PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
#
# 33 5 * * * root /usr/bin/env bash /home/ubuntu/gfddispatch/scripts/database_backup.sh &>> /home/ubuntu/gfddispatch/logs/database_backup.log 2>&1
# -----
