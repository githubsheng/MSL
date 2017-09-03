parser grammar DLSParser;

options { tokenVocab=DLSLexer; }

//dummy
file: SubmitButton;

//file
//: page*
//| pageGroup*
//;
//
//attributes
//: attribute*
//;
//
//attribute
//: Name Equals String
//;
//
//pageGroup
//: pageGroupStart page* End
//;
//
//pageGroupStart
//: Open PageGroup attributes End
//;
//
//page
//: pageStart question+ Submit? End
//;
//
//pageStart
//: Open Page attributes End
//;
//
//question
//: oneDimensionalQuestion
//| twoDimensionalQuestion
//;
//
////questions like single choice are one dimensional because
////they only have rows
//oneDimensionalQuestion
//: ( SingleChoice | MultipleChoice ) Row+
//;
//
////questions like matrix are two dimensional because they have
////both rows and columns
//twoDimensionalQuestion
//: ( SingleChoiceMatrix | MultipleChoiceMatrix ) Row+ Column+
//;