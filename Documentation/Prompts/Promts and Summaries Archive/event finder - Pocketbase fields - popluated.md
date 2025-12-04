

**ITEM**

* field type:
* Required?:
* min length:
* max length:
* Regex pattern:
* Nonempty = toggle
* Presentable = toggle



\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*



**ICONS**

T = Text

pencil = rich editor

\# = number

toggle = bool

envelope = email

chain link = url

calendar = date time

bullet list = select

picture = file

flow chart = relation

{} = JSON





**\*\*\*\*\*\*\*Fields/choices w/in Collections (general) Generalized \*\*\*\***



Add Collection

* Add name
* Set Type (Base, etc)



Add "New field" and specify field type.  Choices are:

* T = Plain Text
* pencil icon = Rich editor
* \# icon = Number
* toggle icon = Bool
* envelope icon = Email
* chain link icon = Url
* calendar icon = DateTime
* bullet list icon = Select
* picture icon = File
* flow chart connector icon = Relation
* {} = JSON



\*\*\*\*\*

**For field type: T = Plain Text**

* name:  (text box)
* then click sprocket icon
* min length:  (text box)
* max length:  (text box)
* Regex pattern:  (text box)
* Nonempty:  (toggle on/off)
* Presentable:  (toggle on/off)



\*\*\*\*\*



**For field type: pencil icon = Rich editor**

* name:  (text box)
* then click sprocket icon
* Nonempty:  (toggle on/off)
* Presentable:  (toggle on/off)
* strip urls domain:  (toggle on/off)



\*\*\*\*\*



**For field type: # icon = Number**

* name:  (text box)
* then click sprocket icon
* Min:  (text box)
* Max:  (text box)
* Nonzero:  (toggle on/off)
* Presentable:  (toggle on/off)
* No decimals:  (toggle on/off)



**For field type: toggle icon = Bool**

* name:  (text box)
* then click sprocket icon
* Nonfalsey:  (toggle on/off)
* Presentable:  (toggle on/off)





**For field type: envelope icon = Email**

* name:  (text box)
* then click sprocket icon
* Except domains:  (text box)
* Only domains: (text box)
* Nonempty:  (toggle on/off)
* Presentable: (toggle on/off)





**For field type: chain link icon = Url**

* name:  (text box)
* then click sprocket icon
* Except domains:  (text box)
* Only domains:  (text box)
* Nonempty:  (toggle on/off)
* Presentable:  (toggle on/off)



**For field type: calendar icon = DateTime**

* name:  (text box)
* then click sprocket icon
* min date (UTC):  (text box)
* max date (UTC):  (text box)
* Nonempty:  (toggle on/off)
* Presentable:  (toggle on/off)





**For field type: bullet list icon = Select**

* name:  (text box)
* then click sprocket icon
* Choices:  (text box)
* Single/multiple:  (picklist)
* Nonempty:  (toggle on/off)
* Presentable:  (toggle on/off)



**For field type: picture icon = File**

* name:  (text box)
* then click sprocket icon
* Single/multiple:  (picklist)
* Allowed types:  (picklist)
* Choose presets:  (picklist)
* thumb sizes:  (text box)
* Max file size:  (text box)
* Nonempty:  (toggle on/off)
* Presentable:  (toggle on/off)
* Protected:  (toggle on/off)





**For field type: flow chart connector icon = Relation**

* name:  (text box)
* then click sprocket icon
* Select Collection:  (picklist)
* Single/multiple:  (picklist)
* Cascade delete:  (picklist true/false)
* Nonempty:  (toggle on/off)
* Presentable:  (toggle on/off)



**For field type: {} = JSON**

* name:  (text box)
* then click sprocket icon
* Max size (bytes):  (text box)
* String value normalizations: (picklist)
* Nonempty:  (toggle on/off)
* Presentable:  (toggle on/off)









**\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*Fields with Values\*\*\*\*\*\*\*\*\*\*\*\*\*\*\***



**slug**

* field type: text
* Required?:I do not see any refence to required
* min length: empty
* max length: 200
* Regex pattern: ^\[a-z0-9]+(?:-\[a-z0-9]+)\*$
* Nonempty = toggle on
* Presentable = off





**description**

* field type: rich editor
* Required?:I do not see any refence to required
* Nonempty = toggle ON
* Presentable = toggle OFF
* strip urls domain = toggle OFF





**status**

* Required?:I do not see any refence to required
* field type: select
* Nonempty = toggle ON
* Presentable = toggle OFF





**event\_url**

* field type: url
* Required?:I do not see any refence to required
* Except domain: empty
* Only domains: empty
* Nonempty = toggle OFF
* Presentable = toggle OFF





**start\_date**

* field type: date time
* Required?:I do not see any refence to required
* min date (UTC): empty
* max date (UTC): empty
* Nonempty = toggle ON
* Presentable = toggle OFF





**end\_date**

* field type: date time
* Required?:I do not see any refence to required
* min date (UTC): empty
* max date (UTC): empty
* Nonempty = toggle ON
* Presentable = toggle OFF





**is\_virtual**

* field type: bool
* Required?: I do not see any refence to required
* nonfalsey: toggle off
* Presentable = toggle off





**venue\_name**

* field type: text
* Required?:I do not see any refence to required
* min length: empty
* max length:200
* Regex pattern: empty
* Nonempty = toggle off
* Presentable = toggle off





**price\_type**

* field type: select
* Required?:I do not see any refence to required
* Nonempty = toggle on
* Presentable = toggle off





**price\_details**

* field type: text
* Required?: I do not see any refence to required
* min length: empty
* max length: 500
* Regex pattern: empty
* Nonempty = toggle off
* Presentable = toggle off





**price\_amount**

* field type: number
* Required?: I do not see any refence to required
* min: 0
* max: empty
* nonzero: toggle off
* Presentable = toggle off
* no decimals = toggle off





**organizer**

* field type: relation
* Required?: I do not see any refence to required
* cascade delete: false
* Nonempty = toggle off
* Presentable = off





**registration\_url**

* field type: url
* Required?: I do not see any refence to required
* except domains: empty
* only domains: empty
* Nonempty = toggle off
* Presentable = toggle off





**contact\_email**

* field type: email
* Required?:I do not see any refence to required
* except domains: empty
* only domains: empty
* Nonempty = toggle off
* Presentable = toggle off



**contact\_phone**

* field type: text
* Required?: I do not see any refence to required
* min length: empty
* max length: 50
* Regex pattern: empty
* Nonempty = toggle off
* Presentable = toggle off







**contact\_name**

* field type: text
* Required?: I do not see any refence to required
* min length: empty
* max length: 200
* Regex pattern: empty
* Nonempty = toggle off
* Presentable = toggle off





**source\_url**

* field type: url
* Required?: I do not see any refence to required
* except domains: empty
* only domains: empty
* Nonempty = toggle off
* Presentable = toggle off



**external\_id**

* field type: text
* Required?: I do not see any refence to required
* min length: empty
* max length: 200
* Regex pattern: empty
* Nonempty = toggle off
* Presentable = toggle off





**first\_seen**

* field type: date time
* Required?:I do not see any refence to required
* min date (UTC): empty
* max date (UTC): empty
* Nonempty = toggle off
* Presentable = toggle OFF



**last\_updated**

* field type: date time
* Required?:I do not see any refence to required
* min date (UTC): empty
* max date (UTC): empty
* Nonempty = toggle off
* Presentable = toggle OFF



**calendar\_reminder\_sent**

* field type: bool
* Required?: I do not see any refence to required
* nonfalsey: toggle off
* Presentable = toggle off





**venue\_address**

* field type: text
* Required?:I do not see any refence to required
* min length: empty
* max length:500
* Regex pattern: empty
* Nonempty = toggle off
* Presentable = toggle off

⦁





**view\_count**

* field type: number
* Required?:I do not see any refence to required
* min length: 0
* max length: empty
* Regex pattern: empty
* nonzero: toggle off
* Presentable = toggle off
* no decimals = toggle off





**timezone**

* field type: text
* Required?:I do not see any refence to required
* min length: empty
* max length: 100
* Regex pattern: empty
* Nonempty = toggle off
* Presentable = toggle off
