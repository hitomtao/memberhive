<?php

use yii\db\Migration;

/**
 * Handles the creation of table `actionlog`.
 */
class m170226_235104_create_actionlog_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('actionlog', [
            'id' => $this->primaryKey(),
            'context' => $this->string(),
            'refId' => $this->integer(),
            'type' => $this->string(),
            'diff' => $this->text(),
            'refUserId' => $this->integer(),
            'created_at' => $this->integer(11),
            'updated_at' => $this->integer(11)
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropTable('actionlog');
    }
}