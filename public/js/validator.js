// Copyright by QuocTrong.

const validator = (selector, options) => {
  let isValid = true;
  form = $(selector);
  form.onsubmit = (e) => {
    let data = {};
    e.preventDefault();
    let inputs = form.querySelectorAll("[name]");
    inputs.forEach((input) => {
      data[input.name] = input.value;
      handleValidate(input);
    });
    if (isValid) {
      if (options.isCallAPI) {
        console.log(data);
      } else {
        form.submit();
      }
    }
  };
  //Định nghĩa hàm sử lý hiển thị lỗi
  const handleMessage = {
    showErrors: (inputElement, messages, errorElement) => {
      let parent = inputElement.parentElement;
      let error = parent.querySelector(errorElement);
      parent.classList.remove("valid");
      parent.classList.add("invalid");
      error.innerText = messages;
    },
    hideErors: (inputElement, errorElement) => {
      let parent = inputElement.parentElement;
      let error = parent.querySelector(errorElement);
      parent.classList.remove("invalid");
      parent.classList.add("valid");
      error.innerText = "";
    },
  };
  //Định nghĩa các rules
  const Rules = {
    required: (element) => {
      //Nếu hợp lệ thì return true, ngược lại là false
      return element.value ? true : false;
    },
    email: (element) => {
      let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      var isValid = regex.test(element.value);
      return isValid ? true : false;
    },
    min: (element, value) => {
      return element.value.length >= value ? true : false;
    },
    max: (element, value) => {
      return element.value.length <= value ? true : false;
    },
    match: (element, value) => {
      let valueElement = form.querySelector('[name="' + value + '"]');
      return element.value == valueElement.value ? true : false;
    },
  };
  //Định nghĩa hàm sử lý các input
  const handleValidate = (input) => {
    nameAtt = input.name;
    rules = options.rules[nameAtt];
    if (rules) {
      for (rule of rules) {
        //Nếu như là rule có giá trị (min, max) hoặc match
        if (rule.includes(":")) {
          ruleName = rule.split(":")[0];
          ruleValue = rule.split(":")[1];
          isValid = Rules[ruleName](input, ruleValue);
        } else {
          isValid = Rules[rule](input);
        }
        if (!isValid) {
          handleMessage.showErrors(input, messages[rule], ".error-message");
          break;
        } else {
          handleMessage.hideErors(input, ".error-message");
        }
      }
    }
  };
  //lấy options rules
  rules = options.rules;
  //lấy options messages
  messages = options.messages;
  if (form) {
    //lấy tát cả input có attribute name
    let inputs = form.querySelectorAll("[name]");
    inputs.forEach((input) => {
      //Xử lý input khi focus
      input.onfocus = () => {
        handleMessage.hideErors(input, ".error-message");
      };
      //Xử lý input khi blur
      input.onblur = () => {
        handleValidate(input);
      };
    });
  }
  return isValid;
};
