
# PocketBase Field Types Reference

     * BOOL Field & Settings:
          ** Field Name (text box): name
          ** Field Type:
          ** Setting - Nonfalsey (toggle): on/off
          ** Setting - Presentable (toggle): on/off

     * DATE/TIME Field & Settings:
          ** Icon: 📅 calendar icon
          ** Field Name (text box): name
          ** Field Type: DateTime
          ** Setting - min date (UTC) (text box):
          ** Setting - max date (UTC) (text box):
          ** Setting - Nonempty (toggle): on/off  
          ** Setting - Presentable (toggle): on/off

     * EMAIL Fields & Settings:
          ** Field Name (text box): name
          ** Field Type (text box): Email
          ** Setting - Except domains (text box):
          ** Setting - Only domains (text box):
          ** Setting - Nonempty (toggle): on/off
          ** Setting - Presentable (toggle): on/off 

     * FILE Field & Settings:
          ** Field Name (text box): name 
          ** Field Type: File
          ** Setting - Single/multiple (picklist): 
          ** Setting - Allowed types (picklist): 
          ** Setting - Choose presets (picklist):  
          ** Setting - thumb sizes (text box):
          ** Setting - Max file size (text box):
          ** Setting - Nonempty (toggle): on/off  
          ** Setting - Presentable (toggle): on/off  
          ** Setting - Protected (toggle): on/off 

     * JSON Field & Settings:
          ** Field Name (text box): name 
          ** Field Type: JSON
          ** Setting - Max size (bytes) (text box):
          ** Setting - String value normalizations (picklist):
          ** Setting - Nonempty (toggle): on/off
          ** Setting - Presentable (toggle): on/off

     * NUMBER Fields & Settings:
          ** Field Name: name 
          ** Field Type (text box): Number 
          ** Setting - Min (text box):
          ** Setting - Max (text box): 
          ** Setting - Nonzero (toggle): on/off 
          ** Setting - Presentable (toggle): on/off 
          ** Setting - No decimals (toggle): on/off

     * PLAIN TEXT Fields & Settings: 
          ** Field Name (text box): name
          ** Field Type (text box): Plain Text
          ** Setting - min length (text box):
          ** Setting - max length (text box):
          ** Setting - Regex pattern (text box):
          ** Setting - nonempty (toggle): on/off
          ** Setting - Presentable (toggle): on/off

     * RELATION Field & Settings:
          ** Field Name (text box): name
          ** Field Type: Relation
          ** Setting - Select Collection (picklist):
          ** Setting - Single/multiple (picklist):
          ** Setting - Cascade delete (toggle): true/false
          ** Setting - Nonempty (toggle): on/off 
          ** Setting - Presentable (toggle): on/off 

     * RICH EDITOR Fields & Settings: 
          ** Field Name (text box): name
          ** Setting - Nonempty (toggle): on/off 
          ** Setting - Presentable (toggle): on/off
          ** Setting - strip urls domain (toggle): on/off

     * SELECT Field & Settings:
          ** Field Name (text box): name
          ** Field Type: Select
          ** Setting - Choices (text box, comma separated): 
          ** Setting - Single/multiple (picklist):
               *** If Multple: Max select (text box): 
          ** Setting - Nonempty (toggle): on/off  
          ** Setting - Presentable (toggle): on/off  

     * WEBSITE Field & Settings:
          ** Field Name (text box): url 
          ** Field Type: URL 
          ** Setting - Except domains (text box): 
          ** Setting - Only domains (text box): 
          ** Setting - Nonempty (toggle): on/off 
          ** Setting - Presentable (toggle): on/off  
          ** Field Purpose/Notes: Link to event page
          ** UI Display: Used for "More details and registration" link