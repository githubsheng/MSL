/*
 right now the vm will send all the questions on the next page in an array. the result
 is something like this:

 [question1Data, question2Data.....]

 this is slightly problematic as the page information and page group information
 is lost

 in the early design, page and page group are converted to functions. for instance,
 when we see a page, we actually calls the page function, and the page function will
 gives us an array of question objects. the page only has `randomize` and `rotate`
 attributes.

 when running the page function, we evaluate the `randomize` and `rotate` attribute
 and based on the result, we return questions in different order. so, all attributes
 (only two in the early design) take effect before vm returns the data, and ui do not
 need to concern about it. so, nothing about the page needed to be passed to ui according
 to the early design.

 but in the late design, we introduced plugins. and we want to allow plugins to work
 with pages. for instance, i can have a background image plugin, that changes the background
 image of a page.

 it may look like this:
 use "background-image"

 [QuestionPage background={bgUrl}]
 [SingleChoice].....
 [SingleChoice].....
 [Submit]
 [PageEnd]

 so in this case, the vm needs to pass the evaluated background url to ui. ui can then loads the
 the background image.

 obviously, with [question1Data, question2Data.....] as the result passed from vm to ui, there is
 no place the page information.

 to keep the page and page group as functions (we don't want to change that...too much effort...),
 we will create a special object called pageInfo (pageGroupInfo will be introduced later), this object carries all page information that needs to be passed
 to ui.

 this is what vm will pass to ui when we introduce pageInfo
 {
 pageInfo: {
 //randomize and rotate, as discussed above, won't be passed...
 attrib1: "evaluated result"
 attrib2: "evaluated result"
 },
 questions: [
 question1Data,
 question2Data....
 ]
 }


 type: actionTypePageData,
 token: response.token,
 pageInfo: response.pageInfo,
 questions: List(response.questions)
 */

export interface VMResponse {
    token: string,
    pageInfo: any,
    pageGroupInfo: any,
    questions: Array<Question>
}

export interface Question {
    id: string;
    type: string;
    text: string;
    //following attributes will be available after question is answered.
    displayedWhen: Date;
    answeredWhen: Date;
    //the time it takes to answer the question.
    duration: number;
    totalClicks: number;
}

interface Option {
    id: string;
    type: string;
    text: string;
    //this attribute will be available after question is answered
    isSelected?: boolean;
    //if an option is a row in a matrix question, after the question is answered, it will have all the cols as its properties.
    //property key will be the col id, and value will the col itself.
}

export interface Row extends Option {

}

export interface Col extends Option {}

export interface RowsOnly extends Question {
    //an object whose keys are row ids, and whose values are rows
    rows: any;
    //for
}

export interface Matrix extends RowsOnly {
    //an object whose keys are col ids, and whose values are cols
    cols: any;
}