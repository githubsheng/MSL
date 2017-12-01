//todo: I want these interfaces to be like a documentations about questions... I need to add details to it.. like stats...

/*

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