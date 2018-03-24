import { shallow } from "@vue/test-utils"
import Bracket from "@/components/Bracket.component.vue"

describe("Bracket.component.vue", () => {
  it("matches snapshot", () => {
    const wrapper = shallow(Bracket)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
