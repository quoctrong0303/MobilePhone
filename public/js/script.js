const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
var scrollButton = $(".arrow-scroll");
var prefile = "";
const app = {
  scrollButton: () => {
    var body = document.body,
      html = document.documentElement;

    var height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    isToggle = false;
    function toggleList() {
      var lists = $$(".toggle-list");
      lists.forEach((element) => {
        element.onclick = () => {
          isToggle = !isToggle;
          if (isToggle) {
            element.classList.add("show");
            element.classList.remove("hide");
          } else {
            element.classList.remove("show");
            element.classList.add("hide");
          }
        };
      });
    }
    toggleList();

    window.onscroll = () => {
      if (
        document.body.scrollTop > height / 4 ||
        document.documentElement.scrollTop > height / 4
      ) {
        scrollButton.style.display = "block";
      } else {
        scrollButton.style.display = "none";
      }
    };

    scrollButton.onclick = () => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };
  },
  showLoadingButton: (formSelector) => {
    let form = $(formSelector);
    let btnElement = form.querySelector(".button");
    let btnElementLoading = form.querySelector(".loading");
    btnElement.style.display = "none";
    btnElementLoading.style.display = "inline-flex";
  },
  hideLoadingButton: (formSelector) => {
    let form = $(formSelector);
    let btnElement = form.querySelector(".button");
    let btnElementLoading = form.querySelector(".loading");
    btnElement.style.display = "block";
    btnElementLoading.style.display = "none";
  },
  handleFocus: (selector, oldClass, newClass) => {
    let Elements = $$(selector);
    if (Elements) {
      Elements.forEach((Element) => {
        // Nếu như click vào element
        Element.onclick = (e) => {
          e.preventDefault();
          // render lại classlist normal
          Elements.forEach((Element) => {
            Element.setAttribute("class", oldClass);
          });
          // Set các class cho element đã click là active
          e.target.closest(selector).setAttribute("class", newClass);
        };
      });
    }
  },
  handleLoadMoreContent: (contentSelector, buttonSelector, minHeight) => {
    let contentElement = $(contentSelector);
    let classMinHeight = "h-[" + minHeight + "]";
    // let classFullHeight = "h-full";
    let btnElement = $(buttonSelector);
    if (btnElement) {
      btnElement.onclick = (e) => {
        //Nếu như thẻ chứa content đang ở chế độ thu nhỏ
        if (contentElement.classList.contains(classMinHeight)) {
          e.preventDefault();
          contentElement.classList.remove(classMinHeight);
          btnElement.innerHTML = `Thu gọn <i class="fas fa-chevron-up"></i>`;
          // Ngược lại nếu content ở chế độ đọc full
        } else {
          e.preventDefault();
          contentElement.classList.add(classMinHeight);
          btnElement.innerHTML = `Xem thêm <i class="fas fa-chevron-down"></i>`;
        }
      };
    }
  },
  toggleModal: (modalSelector, btnSelector) => {
    let btnElements = $$(btnSelector);
    let modalElement = $(modalSelector);
    btnElements.forEach((element) => {
      element.onclick = (e) => {
        e.preventDefault();
        // Ẩn hiện modal bằng cách thay đổi class
        modalElement.classList.toggle("hidden");
        modalElement.classList.toggle("fixed");
        modalElement.classList.toggle("flex");
      };
    });
  },
  removeItemCart: (e) => {
    let element = e.target.closest(".item-cart");
    let cart_count = $("#cart-count");
    if (element) {
      element.remove();
      cart_count.textContent--;
    }
  },
  handleCountInput: (inputElement, minusBtnElement, plusBtnElement) => {
    let input = $$(inputElement);
    let minus = $$(minusBtnElement);
    let plus = $$(plusBtnElement);
    // Gia tri tong tien ao, lam BE se lay gia tri that
    let totalPrice = 100000;
    if (input && minus && plus) {
      minus.forEach((element) => {
        element.onclick = (e) => {
          element.parentElement.querySelector(inputElement).value--;
          // Ajax...
          app.updatePriceInCart("#total-price-cart", totalPrice, "+", 10000);
        };
      });
      plus.forEach((element) => {
        element.onclick = (e) => {
          element.parentElement.querySelector(inputElement).value++;
          // Ajax...
        };
      });
    }
  },
  updatePriceInCart: (totalSelector, totalPrice, caculate, value) => {
    let totalElement = $(totalSelector);
    if (totalElement) {
      if (caculate == "+") {
        totalElement.textContent = totalPrice + value;
      } else {
        if (caculate == "-") {
          totalElement.textContent = totalPrice - value;
        }
      }
    }
  },
  fetchProvinces: (provinceSelector, districtSelector, wardSelector) => {
    let province = document.querySelector(provinceSelector);
    let district = document.querySelector(districtSelector);
    let ward = document.querySelector(wardSelector);
    let url = "https://vapi.vnappmob.com";
    if (province && district && ward) {
      //   Lấy tất cả tỉnh/ thành trên VN
      fetch(url + "/api/province")
        .then((response) => response.json())
        .then((data) => {
          //   console.log(data);
          let html = `<option name="" id="" disabled selected>Tỉnh/thành</option>`;
          data.results.forEach((data) => {
            html += `<option value="${data.province_id}">${data.province_name}</option>`;
          });
          province.innerHTML = html;
          //   console.log(html);
        });

      // Khi select tỉnh thành, thì dựa vào value để lấy ds quận huyện
      province.onchange = (e) => {
        let html = `<option name="" id="" disabled selected>Quận/huyện</option>`;
        fetch(url + `/api/province/district/${e.target.value}`)
          .then((response) => response.json())
          .then((data) => {
            data.results.forEach((data) => {
              html += `<option value="${data.district_id}">${data.district_name}</option>`;
            });
            // console.log(data);
            // console.log(html);
            district.innerHTML = html;
            // Reset lại các phường xã khi chưa chọn quận /huyện
            ward.innerHTML = `<option name="" id="" disabled selected>Phường/xã</option>`;
          });
      };

      //   Khi select quận huyện dựa vào value lấy phường/ xã
      district.onchange = (e) => {
        let html = `<option name="" id="" disabled selected>Phường/xã</option>`;
        fetch(url + `/api/province/ward/${e.target.value}`)
          .then((response) => response.json())
          .then((data) => {
            data.results.forEach((data) => {
              html += `<option value="${data.ward_id}">${data.ward_name}</option>`;
            });
            // console.log(data);
            // console.log(html);
            ward.innerHTML = html;
          });
      };
    }
  },
  handleCheckout: (formSelector, btnCheckout) => {
    formElement = $(formSelector);
    btnElement = $(btnCheckout);
    if (formElement && btnElement) {
      // Khi dã chọn pphường xã thì mới bật nút đặt hàng
      console.log(formElement.querySelector("#checkoutWard"));
      formElement.querySelector("#checkoutWard").onchange = () => {
        app.toggleBtn(
          ".button",
          "btn-primary",
          "btn-disabled",
          "#checkoutWard"
        );
      };
      // Khi nhấn vào nút đặt hàng
      btnElement.onclick = () => {
        let data = {};
        data.fullname = formElement.querySelector(
          "input[name='fullname']"
        ).value;
        data.email = formElement.querySelector("input[name='email']").value;
        data.phone = formElement.querySelector("input[name='phone']").value;
        // option:checked để lấy thông tin element của option đang được check
        data.address = formElement.querySelector(
          "textarea[name='address']"
        ).value;
        data.address +=
          " " +
          formElement.querySelector("select[name='ward'] option:checked")
            .innerHTML;
        data.address +=
          " " +
          formElement.querySelector("select[name='district'] option:checked")
            .innerHTML;
        data.address +=
          " " +
          formElement.querySelector("select[name='province'] option:checked")
            .innerHTML;
        // Dữ liệu được gửi đi, khi nào làm backend thì lấy dữ liẹu sản phẩm trong giỏ từ cart session
        console.log(data);
      };
    }
  },
  toggleBtn: (btnSelector, classEnableBtn, classDisableBtn, dataSelector) => {
    let dataElement = $(dataSelector);
    let btnElement = $(btnSelector);
    if (dataElement && btnElement) {
      // Ở đây làm thêm bước xét tên của tag name nữa
      if (dataElement.tagName == "SELECT") {
        if (
          // Nếu như option có select đang được chọn tồn tại attribute disabled thì không enable button
          dataElement
            .querySelector("option:checked")
            .hasAttribute("disabled") == false
        ) {
          btnElement.removeAttribute("disabled");
          btnElement.classList.add(classEnableBtn);
          btnElement.classList.remove(classDisableBtn);
        } else {
          btnElement.setAttribute("disabled");
          btnElement.classList.remove(classEnableBtn);
          btnElement.classList.add(classDisableBtn);
        }
      }
    }
  },
  toggleDisabledForm: (btnSelector, formSelector) => {
    let btnElement = $(btnSelector);
    let btnUpdatingElement = $(".btnUpdating");
    let btnUpdate = $(".btnUpdate");
    let editElement = $(".button-edit");
    let removeElement = $(".button-remove");
    let formElement = $(formSelector);
    if (btnElement && formElement) {
      btnElement.onclick = (e) => {
        e.preventDefault();
        // Cập nhật lại button
        btnUpdate.classList.toggle("hidden");
        btnUpdatingElement.classList.toggle("hidden");
        editElement.classList.toggle("hidden");
        removeElement.classList.toggle("hidden");

        let inputs = formElement.querySelectorAll("input");
        let textareas = formElement.querySelectorAll("textarea");
        // Xoá attribute disabled khỏi tất cả input trong form khi
        // nút cập nhật thông tin được click
        inputs.forEach((input) => {
          // Không thẻ sửa field username và email
          input.getAttribute("name") == "username" ||
          input.getAttribute("name") == "email"
            ? ""
            : input.removeAttribute("disabled");
        });

        textareas.forEach((input) => {
          input.removeAttribute("disabled");
        });
      };
    }
  },
  handleSaveProfile: () => {
    let editElement = $(".button-edit");
    let removeElement = $(".button-remove");
    let btnSave = $("#btnSave");
    let formSubmit = $("#fProfile");
    let btnUpdate = $(".btnUpdate");
    let btnUpdating = $(".btnUpdating");
    let btnCancel = $("#btnCancel");
    if (btnSave && btnCancel) {
      btnSave.onclick = (e) => {
        let data = {};
        e.preventDefault();
        // Cập nhật lại button
        btnUpdate.classList.toggle("hidden");
        btnUpdating.classList.toggle("hidden");
        editElement.classList.toggle("hidden");
        removeElement.classList.toggle("hidden");
        // Gán dữ liệu vào object data
        data.fullname = formSubmit.querySelector("input[name = 'fullname']")
          ? formSubmit.querySelector("input[name = 'fullname']").value.trim()
          : null;

        data.numberphone = formSubmit.querySelector(
          "input[name = 'numberphone']"
        )
          ? formSubmit.querySelector("input[name = 'numberphone']").value.trim()
          : null;

        data.address = formSubmit.querySelector("textarea[name = 'address']")
          ? formSubmit.querySelector("textarea[name = 'address']").value
          : null;

        data.avatar = formSubmit.querySelector("input[name = 'avatar']")
          ? formSubmit.querySelector("input[name = 'avatar']").files[0]
          : null;

        console.log(data);
      };
      // Khi click vào nút cancel
      btnCancel.onclick = (e) => {
        e.preventDefault();
        // Cập nhật lại button
        btnUpdate.classList.toggle("hidden");
        btnUpdating.classList.toggle("hidden");
        editElement.classList.toggle("hidden");
        removeElement.classList.toggle("hidden");
      };
    }
  },
  handleEditAavatar: (btnEdit, btnRemove, inputSelector, imgSelector) => {
    let editElement = $(btnEdit);
    let removeElement = $(btnRemove);
    let inputElement = $(inputSelector);
    if (editElement && removeElement && inputElement) {
      // Khi nút edit avatar được click
      editElement.onclick = (e) => {
        e.preventDefault();
        inputElement.click();
        // Chạy hàm này để preview image khi upload file
        app.previewImg(inputSelector, imgSelector);
      };

      // Khi nút remove avatar được click
      removeElement.onclick = (e) => {
        // Call API xoá avatar của user
        // ...

        // Thay đổi hình ảnh lại mặc định
        $(imgSelector).setAttribute(
          "src",
          "./img/uploads/—Pngtree—cartoon color simple male avatar_5230557.png"
        );
        // Xoá file hình ảnh khỏi file input
        inputElement.value = "";
        e.preventDefault();
      };
    }
  },
  previewImg: (inputSelector, ImgSelector) => {
    let fileImg = $(inputSelector);
    let imgElement = $(ImgSelector);
    if (fileImg) {
      fileImg.onchange = (e) => {
        if (prefile != "") {
          // console.log("xoa ne");
          URL.revokeObjectURL(prefile);
        }
        let file = e.target.files[0];
        let url = URL.createObjectURL(file);
        prefile = url;
        imgElement.setAttribute("src", url);
        // console.log(url);
      };
    }
  },
  // Xử lý lấy dữ liệu từ form contact, ở thư viện validator
  // đã xây dựng chức năng lấy data
  // Nhưng vì là thư viện chung nên sẽ validate dùng cho nhiều mục đích
  // Nên không thể viết phần call API vào thư viện validator
  // Phải xử lý riêng như hàm bên dưới
  // Những hàm lấy data viết trong file này đa số là
  // lấy biến cứng, không có tham số truyền vào
  // Khi có thay đổi class thì hãy vào đây thay đổi luôn
  handleSendContact: () => {
    let btnSend = $("#btnSendContact");
    let formElement = $("#fContact");
    if (btnSend && formElement) {
      let data = {};
      btnSend.onclick = () => {
        formElement.querySelector("input[name='fullname']")
          ? (data.fullname = formElement.querySelector(
              "input[name='fullname']"
            ).value)
          : null;
        formElement.querySelector("input[name='email']")
          ? (data.email = formElement.querySelector(
              "input[name='email']"
            ).value)
          : null;
        formElement.querySelector("input[name='numberphone']")
          ? (data.numberphone = formElement.querySelector(
              "input[name='numberphone']"
            ).value)
          : null;
        formElement.querySelector("textarea[name='content']")
          ? (data.content = formElement.querySelector(
              "textarea[name='content']"
            ).value)
          : null;
        console.log(data);
      };
    }
  },
  start: () => {
    app.fetchProvinces(
      "#checkoutProvince",
      "#checkoutDistrict",
      "#checkoutWard"
    );
    app.handleEditAavatar(
      ".button-edit",
      ".button-remove",
      "#fileAvatar",
      ".avatar-profile"
    );
    app.handleSendContact();
    app.handleSaveProfile();
    app.toggleDisabledForm("#btnUpdateInfo", "#fProfile");
    app.handleCheckout("#fCheckout", ".btnCheckout");
    app.handleCountInput(".cart-detail-quantity", ".countMinus", ".countPlus");
    app.toggleModal(".modal-specifications", ".toggle-modal");
    app.scrollButton();
    app.handleFocus(
      ".feedback",
      `feedback p-[3px_12px_4px_12px] font-semibold text-[#aaa] relative hover:text-black hover:after:bg-black after:w-full uppercase after:bg-[#aaa] after:content-[''] after:h-[1px] 
    after:bottom-0 after:left-0 after:absolute`,
      `feedback p-[3px_12px_4px_12px] font-semibold text-black relative hover:text-black hover:after:bg-black after:w-full uppercase after:bg-black after:content-[''] after:h-[1px] 
    after:bottom-0 after:left-0 after:absolute`
    );
    app.handleFocus(
      ".rom-item",
      `rom-item hover:cursor-pointer text-center border-item rounded-lg p-1 text-[12px] font-semibold`,
      `rom-item hover:cursor-pointer border-item--active border-item text-center rounded-lg p-1 text-[12px] font-semibold`
    );
    app.handleFocus(
      ".color-item",
      `color-item flex text-center border-item rounded-lg p-1 text-[12px] font-semibold`,
      `color-item flex border-item--active border-item text-center rounded-lg p-1 text-[12px] font-semibold`
    );
    app.handleLoadMoreContent("#product_info-content", ".loadmore", "768px");
    // app.showLoadingButton("#fLogin");
  },
};
app.start();

// lỗi lần trước không dùng được validation jquery là do mình
//định nghĩa $ và $$ ở script.js
