# DOCUMENT NAME:  2025-12-04-1851 PocketBase Fields


---


# INTELLECTUAL PROPERTY NOTICE:  The contents if this chat and everything related to this project is subject to my copyright and may not be used to train AI models or for any purpose. 


---


# PocketBase UI Reference


---


# Last Updated: 2025-12-04


---


# PURPOSE:  This document describes the PocketBase admin interface and how to use it.


---


# GUIDEANCE:  When providing instructions to add/delete/modify Collections, Fields, or Settings, always include what to enter for each and every data element


---


# PocketBase Field Types Reference
       
     * Plain Text 
          ** Icon: [T] icon
          ** Setting: 
               *** Name: name
               *** Type: text box
               *** Notes: field name
          ** Setting: 
               *** Name: min length
               *** Type: text box
               *** Notes: optional minimum
          ** Setting: 
               *** Name: max length
               *** Type: text box
               *** Notes: optional maximum
          ** Setting: 
               *** Name: Regex pattern
               *** Type: text box
               *** Notes: optional validation
          ** Setting: 
               *** Name: nonempty
               *** Type: toggle on/off
               *** Notes: required field
          ** Setting: 
               *** Name: Presentable
               *** Type: toggle on/off
               *** Notes: Show in list view


     * Rich Editor 
          ** Icon: ✏️ pencil icon
          ** Setting: 
               *** Name: name
               *** Type: text box
               *** Notes: field name
          ** Setting: 
               *** Name: Nonempty
               *** Type: toggle on/off 
               *** Notes: Required field 
          ** Setting: 
               *** Name: Presentable
               *** Type: toggle on/off
               *** Notes: Show in list view
          ** Setting: 
               *** Name: strip urls domain
               *** Type: toggle on/off
               *** Notes: Remove domain from URLs


     * Number Field & Settings:
          ** Icon: "#" icon
          ** Setting: 
               *** Name: name 
               *** Type: text box 
               *** Setting Notes: Field name 
          ** Setting: 
               *** Name: Min 
               *** Type: text box 
               *** Notes: Minimum value 
          ** Setting: 
               *** Name: Max 
               *** Type: text box 
               *** Notes: Maximum value 
          ** Setting: 
               *** Name: Nonzero 
               *** Type: toggle on/off 
               *** Notes: Cannot be zero 
          ** Setting: 
               *** Name: Presentable 
               *** Type: toggle on/off 
               *** Notes: Show in list view
          ** Setting: 
               *** Name: No decimals 
               *** Type: toggle on/off 
               *** Notes: Integers only

     * Bool Field & Settings:
          ** Icon: toggle icon
          ** Setting: 
               *** Name: name
               *** Type: text box
               *** Notes: Field name
          ** Setting: 
               *** Name: Nonfalsey
               *** Type: toggle on/off
               *** Notes: Must be true
          ** Setting:                
               *** Name: Presentable
               *** Type: toggle on/off
               *** Notes: Show in list view

     * Email Field & Settings:
          ** Icon: ✉️ envelope icon
          ** Setting: 
               *** Name: name
               *** Type: text box
               *** Notes: Field name
          ** Setting: 
               *** Name: Except domains
               *** Type: text box
               *** Notes: Block specific domains
          ** Setting: 
               *** Name: Only domains
               *** Type: text box   
               *** Notes: Allow only specific domains
          ** Setting: 
               *** Name: Nonempty
               *** Type: toggle on/off  
               *** Notes: Required field
          ** Setting: 
               *** Name: Presentable
               *** Type: toggle on/off  
               *** Notes: Show in list view

     * URL Field & Settings:
          ** Icon: 🔗 chain link icon
          ** Setting: 
               *** Name: name
               *** Type: text box
               *** Notes: Field name
          ** Setting: 
               *** Name: Except domains 
               *** Type: text box  
               *** Notes: Block specific domains
          ** Setting: 
               *** Name: Only domains
               *** Type: text box
               *** Notes: Allow only specific domains
          ** Setting: 
               *** Name: Nonempty 
               *** Type: toggle on/off 
               *** Notes: Required field
          ** Setting: 
               *** Name: Presentable 
               *** Type: toggle on/off  
               *** Notes: Show in list view

     * DateTime Field & Settings:
          ** Icon: 📅 calendar icon
          ** Setting: 
               *** Name: name
               *** Type: text box 
               *** Notes: Field name
          ** Setting: 
               *** Name: min date (UTC)
               *** Type: text box 
               *** Notes: Earliest allowed date
          ** Setting: 
               *** Name: max date (UTC)
               *** Type: text box  
               *** Notes: Latest allowed date
          ** Setting: 
               *** Name: Nonempty
               *** Type: toggle on/off  
               *** Notes: Required field
          ** Setting: 
               *** Name: Presentable
               *** Type: toggle on/off 
               *** Notes: Show in list view


     * Select Field & Settings:
          ** Icon: ☰ bullet list icon
          ** Setting: 
               *** Name: name
               *** Type: text box
               *** Notes: Field name 
          ** Setting: 
               *** Name: Choices
               *** Type: text box 
               *** Notes: Items must be entered in a single line, separated by commas. (e.g., `Option A, Option B, Option C`)
          ** Setting: 
               *** Name: Single/multiple
               *** Type: picklist 
               *** Notes: Allow one or many selections
          ** Setting: 
               *** Name: Nonempty
               *** Type: toggle on/off  
               *** Notes: Required field
          ** Setting: 
               *** Name: Presentable
               *** Type: toggle on/off  
               *** Notes: Show in list view


     * File Field & Settings:
          ** Icon: 🖼️ picture icon
          ** Setting: 
               *** Name: name 
               *** Type: text box 
               *** Notes: Field name
          ** Setting: 
               *** Name: Single/multiple 
               *** Type: picklist 
               *** Notes: Allow one or many files
          ** Setting: 
               *** Name: Allowed types
               *** Type: picklist 
               *** Notes: Restrict file types
          ** Setting: 
               *** Name: Choose presets
               *** Type: picklist  
               *** Notes: Common type presets
          ** Setting: 
               *** Name: thumb sizes
               *** Type: text box 
               *** Notes: Thumbnail dimensions
          ** Setting: 
               *** Name: Max file size
               *** Type: text box 
               *** Notes: Value must be in bytes. See conversion table below
          ** Setting: 
               *** Name: Nonempty
               *** Type: toggle on/off  
               *** Notes: Required field
          ** Setting: 
               *** Name: Presentable
               *** Type: toggle on/off  
               *** Notes: Show in list view
          ** Setting: 
               *** Name: Protected 
               *** Type: toggle on/off 
               *** Notes: Require auth to access


     * File Size Conversion Table:
| Size | Bytes |
|------|-------|
| 1 MB | `1048576` |
| 5 MB | `5242880` |
| 10 MB | `10485760` |
| 25 MB | `26214400` |
| 50 MB | `52428800` |


     * Relation Field & Settings:
          ** Icon: ⤳ flow chart connector icon
          ** Setting: 
               *** Name: name
               *** Type: text box
               *** Notes: Field name
          ** Setting: 
               *** Name: Select Collection
               *** Type: picklist
               *** Notes: Target collection
          ** Setting: 
               *** Name: Single/multiple
               *** Type: picklist
               *** Notes: One or many relations
          ** Setting: 
               *** Name: Cascade delete 
               *** Type: picklist true/false
               *** Notes: Delete related records
          ** Setting: 
               *** Name: Nonempty
               *** Type: toggle on/off 
               *** Notes: Required field
          ** Setting:
               *** Name: Presentable
               *** Type: toggle on/off 
               *** Notes: Show in list view

     * JSON Field & Settings:
          ** Icon: {} icon
          ** Setting: 
               *** Name: name 
               *** Type: text box
               *** Notes: Field name
          ** Setting: 
               *** Name: Max size (bytes)
               *** Type: text box
               *** Notes: Maximum JSON size
          ** Setting: 
               *** Name: String value normalizations
               *** Type: picklist
               *** Notes: Normalization options
          ** Setting: 
               *** Name: Nonempty 
               *** Type: toggle on/off
               *** Notes: Required field
          ** Setting: 
               *** Name: Presentable
               *** Type: toggle on/off 
               *** Notes: Show in list view


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