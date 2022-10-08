# STIF - Standard Tierlist Interchange Format v0.1.1

 - A STIF (pronounced "stiff") file is a json file with certain required attributes, it should have an extension of .stif or .stf.
 - A STIF file must contain the following top level attributes:
    - version: the version of the STIF format used by the file, an Object with the following attributes:
        - major: a Number, must be 0
        - minor: a Number, must be 1
        - patch: a Number, must be 1
    - name: the name of the tierlist, a String
    - tiers: the tiers of the tierlist from highest to lowest, an Array of Objects with the following attributes:
        - color: the color of the tier as an rgb or rgba hex string with a #, if rgba, alpha must be 255
        - name: the name of the tier, a String that must not be ""
    - items: the items in the tierlist, an array of Objects with the following attributes:
        - name: the name of the item, a String that must bot be ""
        - tier: the tier the item has been placed in, a Number, it must be an integer at least -1, if -1 the item is not in any tier, otherwise it is in  tiers[tier]
        - image: a String, the url to the image or ""
    - items in the same tier must be draw in the order in which they appear in items
