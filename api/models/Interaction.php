<?php

namespace app\models;

use \aracoool\uuid\Uuid;
use \aracoool\uuid\UuidBehavior;

/**
 * This is the model class for table "interaction".
 *
 * @property int $id
 * @property string $title
 * @property string $text
 * @property int $typeId
 * @property string $ownerId
 * @property int $isPrivate
 * @property string $createdAt
 * @property string $updatedAt
 */
class Interaction extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'interaction';
    }

    public function behaviors()
    {
        return [
            \yii\behaviors\TimestampBehavior::className(),
            [
                'class' => UuidBehavior::class,
                'version' => Uuid::V4,
                'defaultAttribute' => 'uid'
            ]
        ];
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['text','ownerId','typeId','authorId'], 'required'],
            [['text'], 'string'],
            [['typeId', 'isPrivate'], 'integer'],
            [['created_at', 'updated_at', 'dueOn'], 'safe'],
            [['ownerId', 'authorId'], 'string', 'max' => 36],
            ['uid', '\aracoool\uuid\UuidValidator']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'text' => 'Text',
            'typeId' => 'Type ID',
            'ownerId' => 'Owner ID',
            'authorId' => 'Author ID', // who created this
            'isPrivate' => 'Is Private',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }

    public function getType()
    {
        return $this->hasOne(NoteType::className(), ['id' => 'typeId']);
    }

    public function getOwner()
    {
        return $this->hasOne(Person::className(), ['uid' => 'ownerId']);
    }

    public function getAuthor()
    {
        return $this->hasOne(Person::className(), ['uid' => 'authorId']);
    }

    public function getRecipients()
    {
        return $this->hasMany(Person::className(), ['id' => 'person_id'])
            ->viaTable('person_interaction', ['interaction_id' => 'id']);
    }

    public function getPersonInteraction()
    {
        return $this->hasOne(PersonInteraction::className(), ['interaction_id' => 'id']);
    }

    public function toResponseArray($noMarkup = true)
    {
        $recipients = [];
        foreach ($this->recipients as $recipient) {
            $recipients[] = $recipient->uid;
        }

        return [
            'id' => $this->id,
            'uid' => $this->uid,
            'text' => $noMarkup ? strip_tags($this->text) : $this->text,
            'actions' => [
                'doneOn' => isset($this->personInteraction) ? $this->personInteraction->doneOn : null,
                'completedOn' => isset($this->personInteraction) ? $this->personInteraction->completedOn : null,
                'completedBy' => isset($this->personInteraction) ? $this->personInteraction->completedBy : '',
                'response' => isset($this->personInteraction) ? $this->personInteraction->response : '',
                'delegatedBy' => isset($this->personInteraction) ? $this->personInteraction->delegatedBy : '',
                'delegatedOn' => isset($this->personInteraction) ? $this->personInteraction->delegatedOn : null
            ],
            'author' => [
                'id' => $this->authorId,
                'name' => isset($this->author) ? $this->author->fullName : '',
                'avatar' => isset($this->author->avatar) ? $this->author->avatar : ''
            ],
            'ownerId' => $this->ownerId,
            'type' => $this->type->type,
            'typeId' => $this->typeId,
            'icon' => $this->type->iconString,
            'dueOn' => $this->dueOn,
            'isPrivate' => $this->isPrivate,
            'recipients' => $recipients,
            'createdAt' => date('c', $this->created_at),
            'updatedAt' => date('c', $this->updated_at),
        ];
    }
}
