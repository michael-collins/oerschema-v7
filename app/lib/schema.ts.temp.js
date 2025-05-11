
      // The schema object from schema.ts
      const rawSchema = {
  "version": "1.0.0",
  "classes": {
    "Resource": {
      "label": "Resource",
      "comment": "A general component that all open educational resources are based from.",
      "schema": "root",
      "subClassOf": [
        """http":
        """http":
      ],
      "properties": [
        "parentOf",
        "childOf",
        "forCourse",
        "mainContent",
        "forTopic"
      ]
    },
    "TableOfContents": {
      "label": "TableOfContents",
      "subClassOf": [
        """http":
      ],
      "properties": [
        "entry",
        "childOf",
        "forCourse"
      ]
    },
    "TableOfContentsEntry": {
      "label": "TableOfContentsEntry",
      "subClassOf": [
        "TableOfContents"
      ],
      "properties": [
        "title",
        "forComponent"
      ]
    },
    "Course": {
      "label": "Course",
      "comment": "An instructional course",
      "subClassOf": [
        "Resource",
        """http":
      ],
      "properties": [
        "courseIdentifier",
        "coursePrerequisites",
        "institution",
        "department",
        "program",
        "syllabus",
        "deliveryFormat",
        "enrollmentSize",
        "section",
        "termOffered"
      ]
    },
    "CourseSection": {
      "label": "CourseSection",
      "comment": "A specific instance of a course offered during a specific term",
      "subClassOf": [
        "Resource",
        """http":
      ],
      "properties": [
        "sectionIdentifier",
        "primaryInstructor",
        "syllabus",
        "forCourse",
        "termOffered",
        "enrollmentSize",
        "deliveryFormat"
      ]
    },
    "CourseSyllabus": {
      "label": "CourseSyllabus",
      "comment": "",
      "subClassOf": [
        "Resource"
      ],
      "properties": [
        "section",
        "associatedMedia",
        "forCourse"
      ]
    },
    "Topic": {
      "label": "Topic",
      "comment": "The context of a LearningComponent",
      "subClassOf": [
        "Resource"
      ],
      "properties": [
        "material"
      ]
    },
    "ClassStanding": {
      "label": "ClassStanding",
      "comment": "",
      "subClassOf": [
        "Intangible"
      ],
      "properties": []
    },
    "LearningComponent": {
      "label": "LearningComponent",
      "comment": "A generic component as a base to learning content",
      "subClassOf": [
        "Resource",
        """http":
        """https":
      ],
      "properties": [
        "forCourse",
        "forComponent",
        "hasComponent",
        "doTask",
        "hasLearningObjective",
        "deliveryFormat"
      ]
    },
    "LearningObjective": {
      "label": "LearningObjective",
      "comment": "An expected outcome or skill gained by application of a LearningComponent",
      "subClassOf": [
        "Resource"
      ],
      "properties": [
        "forCourse",
        "forComponent",
        "coursePrerequisites"
      ]
    },
    "AssociatedMaterial": {
      "label": "AssociatedMaterial",
      "comment": "Material that is associated with the course.",
      "subClassOf": [
        "LearningComponent"
      ],
      "properties": []
    },
    "SupportingMaterial": {
      "label": "SupportingMaterial",
      "comment": "Material associated with an instructional component that teaches the learning objectives of that component.",
      "subClassOf": [
        "AssociatedMaterial"
      ],
      "properties": []
    },
    "SupplementalMaterial": {
      "label": "SupplementalMaterial",
      "comment": "Material associated with an instructional component that provides additional information about that component. Examples include Curriculum guides, Family course guides Student study guides.",
      "subClassOf": [
        "AssociatedMaterial"
      ],
      "properties": []
    },
    "ReferencedMaterial": {
      "label": "ReferencedMaterial",
      "comment": "Material associated with an instructional component that is referenced by that component. Examples include primary sources analysed in activities or assessments, material studied in Courses, raw material used in activities or assessments",
      "subClassOf": [
        "AssociatedMaterial"
      ],
      "properties": []
    },
    "InstructionalPattern": {
      "label": "InstructionalPattern",
      "comment": "An assembly of learning components arranged to deliver a learning experience",
      "subClassOf": [
        "LearningComponent"
      ],
      "properties": []
    },
    "Lesson": {
      "label": "Lesson",
      "comment": "",
      "subClassOf": [
        "InstructionalPattern"
      ],
      "properties": []
    },
    "Unit": {
      "label": "Unit",
      "comment": "",
      "subClassOf": [
        "InstructionalPattern"
      ],
      "properties": []
    },
    "Module": {
      "label": "Module",
      "comment": "",
      "subClassOf": [
        "InstructionalPattern"
      ],
      "properties": []
    },
    "Assessment": {
      "label": "Assessment",
      "comment": "An assessment of a student's activity.",
      "subClassOf": [
        "InstructionalPattern",
        """http":
      ],
      "properties": [
        "material",
        "assessing",
        "gradingFormat"
      ]
    },
    "Quiz": {
      "label": "Quiz",
      "comment": "A quiz assessment",
      "subClassOf": [
        "Assessment"
      ],
      "properties": []
    },
    "Submission": {
      "label": "Submission",
      "comment": "An assessment on material provided by a Student",
      "subClassOf": [
        "Assessment"
      ],
      "properties": []
    },
    "Task": {
      "label": "Task",
      "comment": "A task given to a student",
      "subClassOf": [
        "InstructionalPattern",
        """http":
      ],
      "properties": [
        "material"
      ]
    },
    "Activity": {
      "label": "Activity",
      "comment": "An activity performed by students which can be assessed and graded.",
      "subClassOf": [
        "Task"
      ],
      "properties": [
        "assessedBy",
        "gradingFormat"
      ]
    },
    "Project": {
      "label": "Project",
      "comment": "A collection of activities, each of which test a particular skill, demonstrating proficiency across a range of skills",
      "subClassOf": [
        "Activity"
      ],
      "properties": []
    },
    "Practice": {
      "label": "Practice",
      "comment": "",
      "subClassOf": [
        "Task"
      ],
      "properties": []
    },
    "Format": {
      "label": "Format",
      "comment": "The format of the resource.",
      "subClassOf": [
        "Intangible"
      ],
      "properties": []
    },
    "FaceToFaceFormat": {
      "label": "FaceToFaceFormat",
      "comment": "An in-person format where participants are physically present.",
      "subClassOf": [
        "Format"
      ],
      "properties": []
    },
    "GradeFormat": {
      "label": "GradeFormat",
      "comment": "The grading format used in activities and assessments.",
      "alternateType": """http":
      "subClassOf": [
        "Intangible"
      ],
      "properties": []
    },
    "PointGradeFormat": {
      "label": "PointGradeFormat",
      "comment": "A grading format using numerical points",
      "alternateType": """http":
      "subClassOf": [
        "GradeFormat"
      ],
      "properties": []
    },
    "LetterGradeFormat": {
      "label": "LetterGradeFormat",
      "comment": "A grading format using a letter value.",
      "alternateType": """http":
      "subClassOf": [
        "GradeFormat"
      ],
      "properties": []
    },
    "PercentGradeFormat": {
      "label": "PercentGradeFormat",
      "comment": "A grading format using a percentage value.",
      "alternateType": """http":
      "subClassOf": [
        "GradeFormat"
      ],
      "properties": []
    },
    "CompletionGradeFormat": {
      "label": "CompletionGradeFormat",
      "comment": "A boolean grading format determining if the activity had been completed.",
      "alternateType": """http":
      "subClassOf": [
        "GradeFormat"
      ],
      "properties": []
    },
    "Thing": {
      "label": "Thing",
      "comment": "The most generic type of items.",
      "subClassOf": [
        """http":
      ],
      "properties": [
        "name",
        "additionalType",
        "description",
        "image",
        "mainEntityOfPage",
        "sameAs",
        "uri"
      ]
    },
    "Intangible": {
      "label": "Intangible",
      "comment": "A utility class that serves as the umbrella for a number of 'intangible' things such as quantities, structured values, etc.",
      "schema": "intangible",
      "subClassOf": [
        "Thing",
        """http":
      ],
      "properties": []
    },
    "Class": {
      "label": "Class",
      "subClassOf": [
        "Intangible",
        """http":
      ],
      "properties": [
        "supersededBy"
      ]
    },
    "Property": {
      "label": "Property",
      "subClassOf": [
        "Intangible",
        """http":
      ],
      "properties": [
        "rangeIncludes",
        "domainIncludes",
        "supersededBy",
        "inverseOf"
      ]
    },
    "Enumeration": {
      "label": "Enumeration",
      "subClassOf": [
        "Intangible",
        """http":
      ],
      "properties": [
        "supersededBy"
      ]
    },
    "DataType": {
      "label": "DataType",
      "comment": "A general type for data values.",
      "subClassOf": [
        "Class",
        """http":
        ""rdfs":datatype"
      ],
      "properties": []
    },
    "Person": {
      "label": "Person",
      "comment": "",
      "subClassOf": [
        "Thing",
        """http":
      ],
      "properties": []
    },
    "Organization": {
      "label": "Organization",
      "comment": "",
      "subClassOf": [
        "Thing",
        """http":
      ],
      "properties": []
    },
    "Place": {
      "label": "Place",
      "comment": "",
      "subClassOf": [
        "Thing",
        """http":
      ],
      "properties": []
    },
    "StructuredValue": {
      "label": "StructuredValue",
      "comment": "",
      "subClassOf": [
        "Intangible",
        """http":
      ],
      "properties": []
    },
    "CreativeWork": {
      "label": "CreativeWork",
      "comment": "",
      "subClassOf": [
        "Thing",
        """http":
      ],
      "properties": []
    },
    "MediaObject": {
      "label": "MediaObject",
      "comment": "A media object such as a video or interactive object.",
      "subClassOf": [
        "CreativeWork",
        """http":
      ],
      "properties": []
    },
    "ImageObject": {
      "label": "ImageObject",
      "comment": "An image",
      "subClassOf": [
        "MediaObject",
        """http":
      ],
      "properties": []
    },
    "Boolean": {
      "label": "Boolean",
      "comment": "A truthy value",
      "subClassOf": [
        "DataType",
        """http":
      ],
      "properties": []
    },
    "Date": {
      "label": "Date",
      "comment": "A year, month, day value",
      "subClassOf": [
        "DataType",
        """http":
      ],
      "properties": []
    },
    "DateTime": {
      "label": "DateTime",
      "comment": "A value with year, month, day, hour, minute, seconds (optional) and timezone (optional).",
      "subClassOf": [
        "DataType",
        """http":
      ],
      "properties": []
    },
    "Integer": {
      "label": "Integer",
      "comment": "A numeric value of 0 or greater.",
      "subClassOf": [
        "Number",
        """http":
      ],
      "properties": []
    },
    "Number": {
      "label": "Number",
      "comment": "A general numeric value.",
      "subClassOf": [
        "DataType",
        """http":
      ],
      "properties": []
    },
    "Text": {
      "label": "Text",
      "subClassOf": [
        "DataType",
        """http":
      ],
      "properties": []
    },
    "Time": {
      "label": "Time",
      "comment": "A value including hour, minute, seconds (optional) and timezone (optional).",
      "subClassOf": [
        "DataType",
        """http":
      ],
      "properties": []
    },
    "URL": {
      "label": "URL",
      "comment": "A web address",
      "subClassOf": [
        "Text",
        """http":
      ],
      "properties": []
    },
    "Yes": {
      "label": "Yes",
      "comment": "A truthy value of Yes.",
      "subClassOf": [
        "Boolean"
      ],
      "properties": []
    },
    "No": {
      "label": "No",
      "comment": "A truthy value of No.",
      "subClassOf": [
        "Boolean"
      ],
      "properties": []
    },
    "True": {
      "label": "True",
      "comment": "A truthy value of True.",
      "subClassOf": [
        "Boolean",
        """http":
      ],
      "properties": []
    },
    "False": {
      "label": "False",
      "comment": "A truthy value of False.",
      "subClassOf": [
        "Boolean",
        """http":
      ],
      "properties": []
    },
    "ActionType": {
      "label": "ActionType",
      "comment": "A datatype declaring the type of action taken",
      "subClassOf": [
        "DataType"
      ],
      "properties": []
    },
    "Writing": {
      "label": "Writing is involved with the resource",
      "comment": "",
      "subClassOf": [
        "ActionType"
      ],
      "properties": []
    },
    "Reading": {
      "label": "Reading",
      "comment": "Reading is involved with the resource",
      "subClassOf": [
        "ActionType"
      ],
      "properties": []
    },
    "Making": {
      "label": "Making",
      "comment": "Making is involved with the resource",
      "subClassOf": [
        "ActionType"
      ],
      "properties": []
    },
    "Researching": {
      "label": "ResearchingActivity",
      "comment": "Researching is involved with the resource",
      "subClassOf": [
        "ActionType"
      ],
      "properties": []
    },
    "Listening": {
      "label": "Listening",
      "comment": "Listening is involved with the resource",
      "subClassOf": [
        "ActionType"
      ],
      "properties": []
    },
    "Watching": {
      "label": "Watching",
      "comment": "Watching is involved with the resource",
      "subClassOf": [
        "ActionType"
      ],
      "properties": []
    },
    "Reflecting": {
      "label": "Refecting",
      "comment": "Reflecting is involved with the resource",
      "subClassOf": [
        "ActionType"
      ],
      "properties": []
    },
    "Discussing": {
      "label": "Discussing",
      "comment": "Discussing is involved with the resource",
      "subClassOf": [
        "ActionType"
      ],
      "properties": []
    },
    "Observing": {
      "label": "Observing",
      "comment": "Observing is involved with the resource",
      "subClassOf": [
        "ActionType"
      ],
      "properties": []
    },
    "Presenting": {
      "label": "Presenting",
      "comment": "Presenting is involved with the resource",
      "subClassOf": [
        "ActionType"
      ],
      "properties": []
    },
    "Assess": {
      "label": "Assess",
      "comment": "Assess is involved with the resource",
      "subClassOf": [
        "ActionType"
      ],
      "properties": []
    }
  },
  "properties": {
    "entry": {
      "label": "entry",
      "comment": "An entry adds a item to a ToC.",
      "baseVocab": """http":
      "range": ["TableOfContentsEntry"],
      "domain": ["TableOfContents"]
    },
    "name": {
      "label": "name",
      "comment": "The name of the item.",
      "baseVocab": """http":
      "range": ["Text"],
      "domain": ["Resource"]
    },
    "additionalName": {
      "label": "additionalName",
      "comment": "An alias for the item.",
      "baseVocab": """http":
      "range": ["Text"],
      "domain": ["Thing"]
    },
    "additionalType": {
      "label": "additionalType",
      "comment": "An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax.",
      "baseVocab": """http":
      "range": ["Class"],
      "domain": ["Thing"]
    },
    "description": {
      "label": "description",
      "comment": "A short description of the item.",
      "baseVocab": """http":
      "range": ["Text"],
      "domain": ["Thing"]
    },
    "image": {
      "label": "image",
      "comment": "An image of the item.",
      "baseVocab": """http":
      "range": ["URL", "CreativeWork"],
      "domain": ["Thing"]
    },
    "mainEntityOfPage": {
      "label": "mainEntityOfPage",
      "comment": "Indicates a page (or other CreativeWork) for which this thing is the main entity being described.",
      "baseVocab": """http":
      "inverseOf": "mainEntity",
      "range": ["URL", "CreativeWork"],
      "domain": ["Thing"]
    },
    "sameAs": {
      "label": "sameAs",
      "comment": "URL of a reference Web page that unambiguously indicates the item's identity. E.g. the URL of the item's Wikipedia page, Freebase page, or official website.",
      "baseVocab": """http":
      "range": ["URL"],
      "domain": ["Thing"]
    },
    "uri": {
      "label": "uri",
      "comment": "URL of the item.",
      "baseVocab": """http":
      "alternateType": """http":
      "range": ["URL"],
      "domain": ["Thing"]
    },
    "rangeIncludes": {
      "label": "rangeIncludes",
      "comment": "Relates a property to a class that constitutes (one of) the expected type(s) for values of the property.",
      "baseVocab": """http":
      "range": ["Class"],
      "domain": ["Thing"]
    },
    "domainIncludes": {
      "label": "domainIncludes",
      "comment": "Relates a property to a class that is (one of) the type(s) the property is expected to be used on.",
      "baseVocab": """http":
      "range": ["Class"],
      "domain": ["Property"]
    },
    "supersededBy": {
      "label": "supersededBy",
      "comment": "",
      "baseVocab": """http":
      "range": ["Class", "Property", "Enumeration"],
      "domain": ["Class", "Property", "Enumeration"]
    },
    "inverseOf": {
      "label": "inverseOf",
      "comment": "Relates a property to a property that is its inverse. Inverse properties relate the same pairs of items to each other, but in reversed direction. For example, the 'alumni' and 'alumniOf' properties are inverseOf each other. Some properties don't have explicit inverses; in these situations RDFa and JSON-LD syntax for reverse properties can be used.",
      "baseVocab": """http":
      "range": ["Property"],
      "domain": ["Property"]
    },
    "courseIdentifier": {
      "label": "courseIdentifier",
      "comment": "The identifier of the course, i.e. MATH-100",
      "range": ["Text"],
      "domain": ["Course"]
    },
    "sectionIdentifier": {
      "label": "sectionIdentifier",
      "comment": "The identifier of the section, i.e. 001, 002, e3we1-09",
      "range": ["Text"],
      "domain": ["CourseSection"]
    },
    "primaryInstructor": {
      "label": "primaryInstructor",
      "comment": "",
      "range": ["Person"],
      "domain": ["Resource"]
    },
    "instructor": {
      "label": "instructor",
      "comment": "",
      "range": ["Person"],
      "domain": ["Resource"]
    },
    "coursePrerequisites": {
      "label": "coursePrerequisites",
      "comment": "Requirements for taking the Course. May be completion of another Course or a textual description like \"permission of instructor\". Requirements may be a pre-requisite competency, referenced using AlignmentObject.",
      "range": [
        "Course",
        "LearningObjective",
        "LearningComponent",
        """http":
        """http":
        """http":
      ],
      "domain": ["Resource"]
    },
    "institution": {
      "label": "institution",
      "comment": "",
      "range": ["Organization"],
      "domain": ["Resource"]
    },
    "department": {
      "label": "department",
      "comment": "",
      "range": ["Organization"],
      "domain": ["Resource"]
    },
    "program": {
      "label": "program",
      "comment": "",
      "range": ["Organization"],
      "domain": ["Resource"]
    },
    "syllabus": {
      "label": "syllabus",
      "comment": "",
      "range": ["CourseSyllabus"],
      "domain": ["Resource"]
    },
    "currentStanding": {
      "label": "currentStanding",
      "comment": "",
      "range": ["ClassStanding"],
      "domain": ["Resource"]
    },
    "deliveryMode": {
      "label": "deliveryMode",
      "comment": "",
      "range": ["Text"],
      "domain": ["Resource"]
    },
    "enrollmentSize": {
      "label": "enrollment",
      "comment": "",
      "range": ["Number"],
      "domain": ["Resource"]
    },
    "hasLearningObjective": {
      "label": "hasLearningObjective",
      "comment": "A LearningObjective gained as a result of an InstructionalPattern .",
      "range": ["LearningObjective"],
      "domain": ["InstructionalPattern"]
    },
    "forCourse": {
      "label": "forCourse",
      "comment": "The Course in which the resource is meant for.",
      "range": ["Course"],
      "domain": ["Resource"]
    },
    "section": {
      "label": "section",
      "comment": "A specific instance of a course offered during a specific term.",
      "range": ["CourseSection"],
      "domain": ["Course"]
    },
    "termOffered": {
      "label": "termOffered",
      "comment": "A term during which a course or course section is offered.",
      "range": ["Text"],
      "domain": ["Course", "CourseSection"]
    },
    "parentOf": {
      "label": "parentOf",
      "comment": "A parent in relation to a child resource.",
      "range": ["Resource"],
      "domain": ["Resource"]
    },
    "childOf": {
      "label": "childOf",
      "comment": "A child in relation to a parent resource.",
      "range": ["Resource"],
      "domain": ["Resource"]
    },
    "mainContent": {
      "label": "mainContent",
      "comment": "The main content relating to the item.",
      "range": ["Text"],
      "domain": ["Resource"]
    },
    "deliveryFormat": {
      "label": "deliveryFormat",
      "comment": "The format used to deliver the resource.",
      "range": ["Format", "Text"],
      "domain": ["LearningComponent", "Course"]
    },
    "material": {
      "label": "material",
      "comment": "The supporting material assiociated with a resource.",
      "range": ["SupportingMaterial"],
      "domain": ["Resource"]
    },
    "assessing": {
      "label": "assessing",
      "comment": "The activity the assessment is assessing.",
      "range": ["Activity"],
      "domain": ["Assessment"]
    },
    "assessedBy": {
      "label": "assessedBy",
      "comment": "The assessment for this activity.",
      "range": ["Assessment"],
      "domain": ["Activity"]
    },
    "gradingFormat": {
      "label": "gradingFormat",
      "comment": "The grading format for this resource",
      "range": ["GradeFormat", "Text"],
      "domain": ["Activity", "Assessment"]
    },
    "skill": {
      "label": "skill",
      "comment": "A learned skill obtained by completion of a LearningObjective",
      "range": ["Text"],
      "domain": ["LearningObjective"]
    },
    "forComponent": {
      "label": "forComponent",
      "comment": "Which LearningComponent the resource supports (inverse of hasComponent)",
      "range": ["LearningComponent"],
      "domain": ["LearningComponent"]
    },
    "hasComponent": {
      "label": "forComponent",
      "comment": "Which LearningComponent the InstructionalPattern contains or is supported by (inverse of forComponent)",
      "range": ["LearningComponent"],
      "domain": ["LearningComponent"]
    },
    "doTask": {
      "label": "doTask",
      "comment": "Which tasks are to be completed for a LearningComponent",
      "range": ["Task"],
      "domain": ["LearningComponent"]
    },
    "typeOfAction": {
      "label": "typeOfAction",
      "comment": "The type of action to be taken",
      "range": ["ActionType"],
      "domain": ["Task"]
    },
    "forTopic": {
      "label": "forTopic",
      "comment": "The Topic the resource is associated with",
      "range": ["Topic"],
      "domain": ["Resource"]
    },
    "associatedMedia": {
      "label": "associatedMedia",
      "comment": "Refers to any media referenced by the content",
      "range": ["""http":
      "domain": ["Resource"]
    }
  }
}
;
      
      // Function to recursively process the schema and ensure URLs are properly quoted
      function processSchema(obj) {
        if (Array.isArray(obj)) {
          return obj.map(item => {
            if (typeof item === 'string' && (item.startsWith('http://') || item.startsWith('https://'))) {
              return item; // Already a string
            }
            return processSchema(item);
          });
        } else if (typeof obj === 'object' && obj !== null) {
          const result = {};
          for (const key in obj) {
            result[key] = processSchema(obj[key]);
          }
          return result;
        }
        return obj;
      }
      
      // Export the processed schema
      export default processSchema(rawSchema);
    