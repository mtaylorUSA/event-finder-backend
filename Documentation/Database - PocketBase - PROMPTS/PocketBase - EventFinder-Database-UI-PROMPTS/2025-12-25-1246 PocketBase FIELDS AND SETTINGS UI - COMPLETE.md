# DOCUMENT NAME:  2025-12-04-1851 PocketBase Fields


---


# INTELLECTUAL PROPERTY NOTICE:  The contents if this chat and everything related to this project is subject to my copyright and may not be used to train AI models or for any purpose. 


---


# Last Updated: 2025-12-04


---


# PURPOSE:  This document describes the PocketBase admin interface and how to use it.


---


# GUIDEANCE:  When providing instructions to add/delete/modify Collections, Fields, or Settings, always include what to enter for each and every data element


---


# PocketBase Field Types Reference
       

     * BOOL Field & Settings:
          ** Icon: toggle icon

          ** Field Name: name  

          ** Field Type: BOOL

          ** Field Notes: Field name

          ** Setting - Nonfalsey (toggle): on/off
               *** Setting Notes: Must be true

          ** Setting - Presentable (toggle): on/off
               *** Setting Notes: Show in list view


     *  DATE/TIME Field & Settings:
          ** Icon: 📅 calendar icon

          ** Field Name (text box): name
               *** Notes: Field name

          ** Field Type: DateTime

          ** Setting - min date (UTC) (text box):
               *** Notes: Earliest allowed date

          ** Setting - max date (UTC) (text box): 
               *** Notes: Latest allowed date

          ** Setting - Nonempty (toggle): on/off  
               *** Notes: Required field

         ** Setting - Presentable (toggle): on/off
               *** Notes: Show in list view


     * EMAIL Field & Settings:
          ** Icon: ✉️ envelope icon

          ** Field Name (text box): name 
               *** Notes: Field name

          ** Field Type (text box): Email

          ** Setting - Except domains (text box):
               *** Notes: Block specific domains

          ** Setting - Only domains (text box): 
               *** Notes: Allow only specific domains

          ** Setting - Nonempty (toggle): on/off
               *** Notes: Required field

          ** Setting - Presentable (toggle): on/off 
               *** Notes: Show in list view


     * FILE Field & Settings:
          ** Icon: 🖼️ picture icon

          ** Field Name (text box): name 
               *** Notes: Field name
          ** Field Type: File

          ** Setting - Single/multiple (picklist): 
               *** Notes: Allow one or many files

          ** Setting - Allowed types (picklist): 
               *** Notes: Restrict file types

          ** Setting - Choose presets (picklist):  
               *** Notes: Common type presets

          ** Setting - thumb sizes (text box):
               *** Notes: Thumbnail dimensions

          ** Setting - Max file size (text box):
               *** Notes: Value must be in bytes. See conversion table below

          ** Setting - Nonempty (toggle): on/off   
               *** Notes: Required field

          ** Setting - Presentable (toggle): on/off
               *** Notes: Show in list view

          ** Setting - Protected (toggle): on/off 
               *** Notes: Require auth to access


     * JSON Field & Settings:
          ** Icon: "{}" icon

          ** Field Name (text box): name 
               *** Notes: Field name

          ** Field Type: JSON

          ** Setting - Max size (bytes) (text box):
               *** Notes: Maximum JSON size

          ** Setting - String value normalizations (picklist):
               *** Notes: Normalization option

          ** Setting - Nonempty (toggle): on/off
               *** Notes: Required field

          ** Setting - Presentable (toggle): on/off
               *** Notes: Show in list view


     * NUMBER Field & Settings:
          ** Icon: "#" icon

          ** Field Name: name 
               *** Field Notes: Field name 

          ** Field Type (text box): Number 
 

          ** Setting - Min (text box): 
              *** Notes: Minimum value 

          ** Setting - Max (text box):
              *** Notes: Minimum value 

          ** Setting - Nonzero (toggle): on/off 
               *** Notes: Cannot be zero 

          ** Setting - Presentable (toggle): on/off 
               *** Notes: Show in list view

          ** Setting - No decimals (toggle): on/off
               *** Notes: Integers only


     * PLAIN TEXT Field
          ** Icon: [T] icon

          ** Field Name (text box): name
               *** Field Notes: field name
          ** Field Type (text box): Plain Text

          ** Setting - min length (text box):
               *** Notes: optional minimum

          ** Setting - max length (text box):
               *** Notes: optional maximum

          ** Setting - Regex pattern (text box):
               *** Notes: optional validation

          ** Setting - nonempty (toggle): on/off
               *** Notes: required field

          ** Setting - Presentable (toggle): on/off
               *** Notes: Show in list view


     * RELATION Field & Settings:
          ** Icon: ⤳ flow chart connector icon

          ** Field Name (text box): name
               *** Notes: Field name
         
          ** Field Type: Relation

          ** Setting - Select Collection (picklist):
               *** Notes: Target collection

          ** Setting - Single/multiple (picklist):
               *** Notes: One or many relations

          ** Setting - Cascade delete (toggle): true/false
               *** Notes: Delete related records

          ** Setting - Nonempty (toggle): on/off 
               *** Notes: Required field
        
          ** Setting - Presentable (toggle): on/off 
               *** Notes: Show in list view



     * RICH TEXT Field & Settings:
          ** Icon: ✏️ pencil icon

          ** Field Name (text box): name
               *** Notes: field name

          ** Setting - Nonempty (toggle): on/off 
               *** Notes: Required field 

          ** Setting - Presentable (toggle): on/off
               *** Notes: Show in list view

          ** Setting - strip urls domain (toggle): on/off
               *** Notes: Remove domain from URLs



     * SELECT Field & Settings:
          ** Icon: ☰ bullet list icon

          ** Field Name (text box): name
               *** Notes: Field name
          ** Field Type: Select

          ** Setting - Choices (text box, comma separated): 
               *** Notes: Items must be entered in a single line, separated by commas. (e.g., `Option A, Option B, Option C`)

          ** Setting - Single/multiple (picklist):
               *** Notes: Allow one or many selections
               *** If Multple: Max select (text box): 

          ** Setting - Nonempty (toggle): on/off   
               *** Notes: Required field

          ** Setting - Presentable (toggle): on/off  
               *** Notes: Show in list view



     * URL Field & Settings:
          ** Icon: 🔗 chain link icon

          ** Field Name (text box):  
          ** Field Type: URL 
          ** Setting - Except domains (text box): 
          ** Setting - Only domains (text box): 
          ** Setting - Nonempty (toggle): on/off 
          ** Setting - Presentable (toggle): on/off  
          ** Field Purpose/Notes: Link to event page
UI Display: ✅ Used for "More details and registration" link

---


     * File Size Conversion Table:
| Size | Bytes |
|------|-------|
| 1 MB | `1048576` |
| 5 MB | `5242880` |
| 10 MB | `10485760` |
| 25 MB | `26214400` |
| 50 MB | `52428800` |




---


# How to Add a New Collection to PocketBase
1. Click [+ New collection] button
2. Add name
3. Specify Type:
   - Base Collection
   - View Collection
   - Auth Collection
4. Use the [Fields] tab, not the [API Rules] tab
5. Add at least one field (required to save)
6. Click the [Create] button


---


# How to Add a New Field in PocketBase
1. Go to PocketBase Admin → Collections
2. Click the collection name
3. Click [New field]
4. Choose field type (icons above)
5. Enter field name
6. Click [sprocket icon] ⚙️ for settings
7. Configure settings as needed
8. Click [Save]


---


# How to Add a New Record to a Collection
1. Click on the named Collection
2. Click [+ New record] button
3. Fill in field values
4. Click [Save]


---


# How to Review APIs
1. Click on the named Collection
2. Click [</> API Preview] button