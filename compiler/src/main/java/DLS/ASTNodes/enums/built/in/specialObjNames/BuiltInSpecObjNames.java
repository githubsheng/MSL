package DLS.ASTNodes.enums.built.in.specialObjNames;

public enum BuiltInSpecObjNames {
    PagePropObject("_pagePropObj"),
    PageGroupPropObject("_pageGroupPropObj");

    private final String name;

    BuiltInSpecObjNames(String name) {
        this.name = name;
    }

    public String getName(){
        return this.name;
    }

}
