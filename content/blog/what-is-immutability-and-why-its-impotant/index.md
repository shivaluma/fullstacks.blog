---
title: Immutability là gì và tại sao nó lại quan trọng
date: "2020-10-04"
description: Một khái quát ngắn gọn và đầy đủ về Immutable/Immutability trong Javascript và React.
tags: ["javascript", "react"]
---

# Giới thiệu

**Immutability (sự bất biến)** là một khái niệm được sử dụng thường xuyên khi bạn lập trình với các đối tượng (Object), đặc biệt là trong Javascript và React.

Hiểu nôm na thì ta có thể diễn giải Immutability là **"Các trạng thái/ dữ liệu của một đối tượng immutability không thể bị thay đổi từ khi nó được tạo ra"**, nghe thì có vẻ dễ hiểu nhưng khi thật sự đào sâu ta mới thấy nó **devil** đến mức nào :(.

Trước khi đào sâu để biết tại sao Immutability lại quan trọng trong JS/React, thì chúng ta cùng tìm hiểu trước về **Mutation (Sự thay đổi)** nhé~!

# Mutation (Sự thay đổi)

Mutation là tất cả các cách thức mà chúng ta tác động tới một đối tượng và làm thay đổi giá trị của nó.

```javascript
let a = 1
a = 2
console.log(a) //2
// Chúng ta đã thay đổi giá trị của biến a
```

# Truyền bằng tham trị (Value) và truyền bằng tham chiếu (Reference)

Trong javascript, một biến có thể chứa dữ liệu có kiểu tham trị (number, string, boolean, null, undefined và Symbol) hoặc là kiểu tham chiếu ( Object, Array và Function)

## Truyền bằng tham trị

```javascript
let a = 12
let b = a
console.log(a) // 12
console.log(b) // 12

a = 15
console.log(a) // 15
console.log(b) // 12
```

Chúng ta có hai biến a và b. Sau đó, chúng ta thay đổi giá trị của a bằng 15. Như thế, chúng ta đã mutate dữ liệu của a. Nhưng dữ liệu của b vẫn như ban đầu. Trong javascript, chúng ta gọi đây là Pass by Value.

## Truyền bằng tham chiếu

```javascript
let a = {
    value : 12;
}
let b = a
console.log(a.value) // 12
console.log(b.value) // 12

a.value = 15;
console.log(a.value) // 15
console.log(b.value) // 15 ?? nani dàfug
```

Thay vì **a** là number thì giờ **a** là một biến lưu reference của một anonymous object. **b** được gán bằng **a** tức là copy giá trị reference của object đang nằm trong **a** và gán nó vào **b**.

Khi giá trị value được thay đổi, thì khi lấy giá trị bằng biến **a** hay **b** thì chúng ta cũng sẽ lấy được giá trị giống nhau.

**Pass by reference** đều xảy ra với các loại giá trị Array, Object, Function khi chúng ta gán thông thường, hoặc khi các giá trị này làm tham số của hàm.

```javascript
let newArr = [1, 2, 3, 4, 5, 6]

function addNum(a) {
  a.push(7)
}

addNum(newArr)
console.log(newArr) // [1,2,3,4,5,6,7] WHAAAAAT?
```

# Có vấn đề gì với Mutate Objects ???

Điều đầu tiên mà bạn học được khi làm việc với React là bạn không nên thay đổi một object

```javascript
// gà thế, thay đổi mảng gốc rồi
items.push(newItem)
// hay đó, làm như này sẽ không thay đổi mảng gốc.
const newItems = items.concat([newItem])
```

Nhưng

Bạn biết tại sao không ?

Bạn biết vì sao không được thay đổi các object không?

![Dont mutate object](https://i0.wp.com/blog.logrocket.com/wp-content/uploads/2018/04/0_88XOllaZvI-HBP8o.png?w=422&ssl=1)

**Sự thật là không có gì sai với việc thay đổi một Object**

**Guest** : À thế à, thế những vấn đề trong các tình huống concurrency thì sao nhỉ, như starvation, race condition, deadlock ??

**Shivaluma** : À thế làm sao mà à, mày muốn lập trình nhanh thì phải làm như vậy đó, đây là sự đánh đổi, hiểu chưa :v

# Immutability

Nhắc lại

> Các trạng thái/ dữ liệu của một đối tượng
> immutability không thể bị thay đổi từ khi nó được
> tạo ra

**Thành** : Nghe vẫn có vẻ mơ hồ quá, cho cái ví dụ thực tế đê bạn ơi

**Shivaluma** : String trong javascript là Immutability Types đó bợn.

Ta có thể khai báo một string như thế này

```javascript
let str = "Thanh đẹp trai"
```

**Thành** : String mà immutability à, xem t thay đổi nó nè.

```javascript
let str = "Thanh đẹp trai"
str[2] = "à"
console.log(str) // Thanh đẹp trai
```

**Thành** : Cái éo.

Không giống như mảng, ta không thể thay đổi trực tiếp ký tự của một chuỗi.

Làm như thế này

```javascript
str = "abd"
```

Sẽ gán một chuỗi khác vào biến str

Bạn cũng có thể cho biến str là constant bằng cách khai báo

```javascript
const str = "abc"
```

Khi gán string khác vào biến str, một lỗi sẽ được throw ra (mặc dù nó không liên quan tới immutability lắm ^^).

Nếu bạn muốn thay đổi string value, thì bạn cần phải sử dụng một số method được định nghĩa sẵn của đối tượng string như **replace**, **toUppercase** hoặc **trim**, ...

Tất cả những method trên đều không thay đổi string gốc, nó đều trả về một string mới.

**Guest** : Ok hay đó, còn với String Object thì sao (cho bạn nào chưa biết thì JS cũng có kiểu đối tượng Object cho string, nó cũng giống như là Boxing bên Java vậy).

**Shivaluma** : String Object thì cũng là string đấy nhưng nó không phải **Immutability** đâu nha.
Vì ta có thể gán cho nó thuộc tính mới giống như một object thông thường.

```javascript
const str = new String("abc")
str.myNewProperty = "some value"

console.log(str.myNewProperty) // some value
```

![immutability string](https://i2.wp.com/blog.logrocket.com/wp-content/uploads/2018/04/0_f3DODCqLTseJ5h3L.png?w=302&ssl=1)

Ví dụ trên cho ta thấy cách tạo ra một Object String từ constructor với một giá trị immutability string. Nhưng mà chúng ta có thể thêm thuộc tính mới cho wrapper này bởi vì nó là một object, và nó không được **đóng băng**.

> Đọc thêm
> Object trong JS có một số phương thức có thể ngăn chặn việc thay đổi nội dung bên trong của một object. Điển hình là Object.freeze(someObj), ngoài ra còn có một số hàm khác như Object.seal(),...

```javascript
const obj = {
  prop: 42,
}

Object.freeze(obj)

obj.prop = 33
// sẽ quăng một lỗi nếu đang ở chế độ 'strict mode'
obj.asd = 22
console.log(obj.prop)
// expected output: 42
console.log(obj.asd)
// expected output: undefined
```

Điều này dẫn tới một khái niệm quan trọng để hiểu, đó chính là sự khác biệt giữa so sánh bằng của tham chiếu và giá trị.

# So sánh giá trị và so sánh tham chiếu

Với so sánh tham chiếu, nếu hai biến cùng trỏ đến một object, thì kết quả của những toán tử **===**, **==**,
**!==**, **!=**, là như nhau.

```javascript
var str1 = ‘abc’;
var str2 = str1;
str1 === str2 // true
```

Điều này cũng tương tự khi hai biến trỏ đến giá trị giống nhau, các giá trị này đều là immutable

```javascript
var str1 = ‘abc’;
var str2 = ‘abc’;
str1 === str2 // true
var n1 = 1;
var n2 = 1;
n1 === n2 // also true
```

Vậy đối với các Object thì sao :

```javascript
var str1 =  new String(‘abc’);
var str2 = new String(‘abc’);
str1 === str2 // false
var arr1 = [];
var arr2 = [];
arr1 === arr2 // false
```

Trong các trường hợp này, thì những object khác nhau sẽ được tạo ra, chúng sẽ có một địa chỉ riêng trong vùng nhớ, và , reference của chúng sẽ khác nhau.

Nếu như bạn thật sự muốn kiểm tra hai object có giống nhau hay không, bạn cần phải sử dụng so sánh giá trị, khi đó thì bạn phải kiểm tra giá trị của tất cả thuộc tính của object có giống nhau hay không.

Thật tiếc là trong Javascript không hỗ trợ phương thức nào để làm việc này.

Nếu như bạn đang làm việc với kiểu String Object, thì bạn có thể sử dụng phương thức valueOf, hoặc trim thì nó sẽ trả về string value.

```javascript
var str1 =  new String(‘abc’);
var str2 = new String(‘abc’);
str1.valueOf() === str2.valueOf() // true
str1.trim() === str2.trim() // true
```

**Guest** : Nhưng những kiểu khác thì sao nhỉ ?

**Shivaluma** : Đừng lo, đã có những thư viện được xây dựng sẵn như lodash, underscore để giải quyết vấn đề này rồi, không thì bạn tự viết methods cũng được mà :D ?

**Guest** : Vậy nãy giờ chém tùm lum vậy thì nó liên quan gì đến Immutability và React ?

Như nãy giờ chúng ta đã thấy, thì việc kiểm tra hai object bằng nhau nếu chúng Immutable dễ vãi ra, React chắc chắn nó phải nhận ra và sử dụng concept này để tối ưu hiệu suất.

# Tối ưu hiệu năng trong React với Immutability

React duy trì một biểu diễn của UI ở bên trong chính nó, hay còn gọi là Virtual DOM.

> DOM hay còn gọi là Document Object Model, nó được trình duyệt parse từ HTML của trang web và xây dựng một cấu trúc dữ liệu cây từ những node HTML này.
> ![Dom Tree](https://techinsight.com.vn/wp-content/uploads/2020/08/1-1-1024x567.png)

Khi state của một component thay đổi, Virtual DOM sẽ được React update để phản ánh những giá trị được thay đổi đó. Việc thay đổi Virtual DOM sẽ dễ dàng và nhanh hơn DOM thật nhiều vì browser không cần phải repaint lại những thay đổi này.

Sau đó, React sẽ so sánh Virtual DOM hiện tại với một bản được cache/snapshot trước đó để xem những thành phần nào được thay đổi. Quá trình này gọi là **reconciliation**

Sau đó, chỉ những thành phần nào được thay đổi mới được React thay thế trên Real DOM.

Nhưng thi thoảng, một số phần của DOM cũng bị render lại khi chúng không thay đổi nhưng bị ảnh hướng bởi side effects của các thành phần khác.
![react rerender](https://miro.medium.com/max/1100/1*f-dKZBylX_qzaloi2AC0dg.jpeg)

Trong những trường hợp này, bạn có thể cần phải implement hàm shouldComponentUpdate trong Component đó để kiểm tra xem các thuộc tính, state hoặc props có thực sự thay đổi hay không và báo lại cho React để thực hiện việc update.

```javascript
class MyComponent extends Component {
  // ...
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.currentColor !== nextProps.color) {
      // Màu khác rồi, phải render lại thôi
      return true
    }
    // màu vẫn như cũ mà, không render đâu
    return false
  }
  // ...
}
```

Nếu như thuộc tính và state của component này là Immutable Objects hoặc là giá trị, thì chúng ta so sánh chúng rất đơn giản, sử dụng toán tử =.

Bằng cách tiếp cận này, Immutability đã xoá đi sự phức tạp khi so sánh Mutable Object :D

Bởi vì thỉnh thoảng việc so sánh những object rất là khó khăn.

Hãy nghĩ về một object với rất rất là **deeeeeeeeeeeeeep**.

```javascript
myPackage.sender.address.country.id = 1
```

Làm như thế nào để kiểm tra một cách hiệu quả nếu có một thành phần nào đó thay đổi ?

Với mảng, Ta có thể kiểm tra hai mảng bằng nhau bằng việc duyệt và so sánh từng phần tử của chúng. Vậy nếu mảng có rất rất rất nhiều phần tử thì sao, chúng ta sẽ
mất một chi phí khá lớn để so sánh những mảng như vậy.

Vì vậy, cách đơn giản nhất là dùng một Immutable Object

Nếu một object cần được update, thì một object mới với một giá trị mới sẽ được tạo ra, bởi vì object trước là immutable và không thể được thay đổi.

Và chúng ta có thể sử dụng reference equality để kiểm tra nếu object có thay đổi hay không.

Nhưng đối với một số người, khái niệm này có vẻ hơi mâu thuẫn hoặc đối lập với những ý tưởng về hiệu suất và sự đơn giản.

Vì vậy hãy xem xét việc tạo đối tượng mới và triển khai tính bất biến trong phần sau nhé !

# Thể hiện Immutability trong Javascript / React như thế nào
